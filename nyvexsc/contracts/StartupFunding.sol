// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "./utils/Base64.sol";

contract StartupFunding is ERC721URIStorage {
    uint256 private _nextTokenId;
    using Strings for uint256;
    
    

    struct Funder {
        address funderAddress;
        uint256 amount;
        uint256 tokenId; // NFT token ID for this investment
    }

    struct EquityHolder {
        string name;
        uint256 percentage;
    }

    struct Document {
        string ipfsHash;
        string documentType;
        uint256 timestamp;
    }

    struct Milestone {
        string title;
        string description;
        uint256 fundAmount;
        bool isCompleted;
        string ipfsHash; // For proof of completion
        uint256 completionTimestamp;
    }

    struct Startup {
        address owner;
        string title;
        string description;
        EquityHolder[] equityHolders;
        string pitchVideo; // URL or IPFS hash of pitch video
        string image;
        uint256 target;
        uint256 deadline;
        uint256 amountCollected;
        uint256 amountReleased; // Amount released to the startup
        Funder[] funders;
        Document[] documentHashes; // Array of document IPFS hashes
        Milestone[] milestones; // Array of milestones
        bool isVerified;
    }

    struct LoanRequest {
        address requester;
        string name;
        string purpose;
        uint256 amount;
        uint256 duration;
        uint256 amountCollected;
        Funder[] lenders; // Array of lenders who have funded the loan
        Document[] documentHashes; // Array of document IPFS hashes
        bool repaid;
    }

    mapping(uint256 => Startup) public startups;
    mapping(uint256 => LoanRequest) public loanRequests;
    mapping(address => mapping(uint256 => uint256)) public investorTotalAmount; // Track total investment per investor per startup
    mapping(uint256 => bool) public tokenBurned; // Track if a token has been burned
    
    address public verifier; // Address that can verify startups and milestones

    uint256 public numberOfStartups = 0;
    uint256 public numberOfLoans = 0;

    event InvestmentNFTMinted(address investor, uint256 startupId, uint256 tokenId, uint256 amount);
    event InvestmentNFTBurned(uint256 tokenId);

    constructor() ERC721("NyveX Investment Certificate", "NYVEX") {
        verifier = msg.sender; // Initially set the contract deployer as verifier
    }

    // Set a new verifier
    function setVerifier(address _verifier) public {
        require(msg.sender == verifier, "Only the current verifier can set a new verifier");
        verifier = _verifier;
    }

    // Create a new startup campaign
    function createStartup(
        address _owner,
        string memory _title,
        string memory _description,
        EquityHolder[] memory _equityHolders,
        string memory _pitchVideo,
        string memory _image,
        uint256 _target,
        uint256 _deadline
    ) public returns (uint256) {
        require(_deadline > block.timestamp, "Deadline must be in the future");

        Startup storage startup = startups[numberOfStartups];

        startup.owner = _owner;
        startup.title = _title;
        startup.description = _description;
        startup.pitchVideo = _pitchVideo;
        startup.image = _image;
        startup.target = _target;
        startup.deadline = _deadline;
        startup.amountCollected = 0;
        startup.amountReleased = 0;
        startup.isVerified = false;

        for (uint256 i = 0; i < _equityHolders.length; i++) {
            startup.equityHolders.push(_equityHolders[i]);
        }

        numberOfStartups++;

        return numberOfStartups - 1;
    }

    // Verify a startup
    function verifyStartup(uint256 _id) public {
        require(msg.sender == verifier, "Only the verifier can verify startups");
        startups[_id].isVerified = true;
    }

    // Add a document to a startup
    function addStartupDocument(
        uint256 _id,
        string memory _ipfsHash,
        string memory _documentType
    ) public {
        Startup storage startup = startups[_id];
        require(
            msg.sender == startup.owner || msg.sender == verifier,
            "Only the owner or verifier can add documents"
        );

        Document memory newDocument = Document({
            ipfsHash: _ipfsHash,
            documentType: _documentType,
            timestamp: block.timestamp
        });

        startup.documentHashes.push(newDocument);
    }

    // Add a milestone to a startup
    function addStartupMilestone(
        uint256 _id,
        string memory _title,
        string memory _description,
        uint256 _fundAmount
    ) public {
        Startup storage startup = startups[_id];
        require(
            msg.sender == startup.owner,
            "Only the owner can add milestones"
        );

        // Ensure there are enough funds available
        uint256 totalMilestoneFunds = 0;
        for (uint256 i = 0; i < startup.milestones.length; i++) {
            totalMilestoneFunds += startup.milestones[i].fundAmount;
        }
        require(
            totalMilestoneFunds + _fundAmount <= startup.amountCollected,
            "Not enough funds available for this milestone"
        );

        Milestone memory newMilestone = Milestone({
            title: _title,
            description: _description,
            fundAmount: _fundAmount,
            isCompleted: false,
            ipfsHash: "",
            completionTimestamp: 0
        });

        startup.milestones.push(newMilestone);
    }

    // Complete a milestone
    function completeMilestone(
        uint256 _startupId,
        uint256 _milestoneId,
        string memory _proofIpfsHash
    ) public {
        require(msg.sender == verifier, "Only the verifier can complete milestones");
        
        Startup storage startup = startups[_startupId];
        require(_milestoneId < startup.milestones.length, "Invalid milestone ID");
        
        Milestone storage milestone = startup.milestones[_milestoneId];
        require(!milestone.isCompleted, "Milestone already completed");
        
        milestone.isCompleted = true;
        milestone.ipfsHash = _proofIpfsHash;
        milestone.completionTimestamp = block.timestamp;
        
        // Release funds for this milestone
        startup.amountReleased += milestone.fundAmount;
        
        // Transfer funds to the startup owner
        (bool sent, ) = payable(startup.owner).call{value: milestone.fundAmount}("");
        require(sent, "Failed to send Ether");
    }

    // Fund a startup campaign and mint an NFT as proof of investment
    function fundStartup(uint256 _id) public payable {
        uint256 amount = msg.value;
        Startup storage startup = startups[_id];

        require(block.timestamp < startup.deadline, "Funding period has ended");
        require(
            startup.amountCollected < startup.target,
            "Funding target reached"
        );

        // Mint NFT for the investor
        uint256 newTokenId = _mintInvestmentNFT(msg.sender, _id, amount, startup.title, startup.image);
        
        // Update investor's total amount for this startup
        investorTotalAmount[msg.sender][_id] += amount;
        
        // Add funder with token ID
        startup.funders.push(Funder(msg.sender, amount, newTokenId));
        startup.amountCollected += amount;
        
        emit InvestmentNFTMinted(msg.sender, _id, newTokenId, amount);
    }

    // Internal function to mint an NFT as proof of investment
    function _mintInvestmentNFT(
        address _investor, 
        uint256 _startupId, 
        uint256 _amount,
        string memory _startupTitle,
        string memory _startupImage
    ) internal returns (uint256) {
        uint256 newTokenId = _nextTokenId++;
        
        // Calculate equity percentage based on investment amount and target
        uint256 equityPercentage = (_amount * 10000) / startups[_startupId].target;
        
        // Generate JSON metadata for the NFT
        string memory json = Base64.encode(
            bytes(
                string(
                    abi.encodePacked(
                        '{"name": "NyveX Investment in ', _startupTitle, '", ',
                        '"description": "This NFT represents an investment in ', _startupTitle, ' through NyveX platform.", ',
                        '"image": "', _startupImage, '", ',
                        '"attributes": [',
                            '{"trait_type": "Startup ID", "value": "', _startupId.toString(), '"}, ',
                            '{"trait_type": "Investment Amount", "value": "', _amount.toString(), ' AVAX"}, ',
                            '{"trait_type": "Equity Percentage", "value": "', (equityPercentage / 100).toString(), '.', (equityPercentage % 100).toString(), '%"}, ',
                            '{"trait_type": "Investment Date", "value": "', block.timestamp.toString(), '"}, ',
                            '{"trait_type": "Investor", "value": "', uint256(uint160(_investor)).toString(), '"}',
                        ']}'
                    )
                )
            )
        );

        string memory tokenURI = string(abi.encodePacked("data:application/json;base64,", json));
        
        _mint(_investor, newTokenId);
        _setTokenURI(newTokenId, tokenURI);
        
        return newTokenId;
    }

    // Update NFT metadata when investor adds more funds
    function updateInvestmentNFT(uint256 _tokenId, uint256 _startupId, uint256 _newTotalAmount) internal {
        require(_exists(_tokenId), "Token does not exist");
        
        Startup storage startup = startups[_startupId];
        
        // Calculate new equity percentage
        uint256 equityPercentage = (_newTotalAmount * 10000) / startup.target;
        
        // Generate updated JSON metadata
        string memory json = Base64.encode(
            bytes(
                string(
                    abi.encodePacked(
                        '{"name": "NyveX Investment in ', startup.title, '", ',
                        '"description": "This NFT represents an investment in ', startup.title, ' through NyveX platform.", ',
                        '"image": "', startup.image, '", ',
                        '"attributes": [',
                            '{"trait_type": "Startup ID", "value": "', _startupId.toString(), '"}, ',
                            '{"trait_type": "Investment Amount", "value": "', _newTotalAmount.toString(), ' AVAX"}, ',
                            '{"trait_type": "Equity Percentage", "value": "', (equityPercentage / 100).toString(), '.', (equityPercentage % 100).toString(), '%"}, ',
                            '{"trait_type": "Investment Date", "value": "', block.timestamp.toString(), '"}, ',
                            '{"trait_type": "Investor", "value": "', uint256(uint160(ownerOf(_tokenId))).toString(), '"}',
                        ']}'
                    )
                )
            )
        );

        string memory tokenURI = string(abi.encodePacked("data:application/json;base64,", json));
        _setTokenURI(_tokenId, tokenURI);
    }

    // Burn NFT if investment is refunded
    function burnInvestmentNFT(uint256 _tokenId) public {
        require(_exists(_tokenId), "Token does not exist");
        require(
            ownerOf(_tokenId) == msg.sender || msg.sender == verifier,
            "Only token owner or verifier can burn"
        );
        
        _burn(_tokenId);
        tokenBurned[_tokenId] = true;
        
        emit InvestmentNFTBurned(_tokenId);
    }

    // Get investor's NFT tokens for a specific startup
    function getInvestorTokens(address _investor, uint256 _startupId) public view returns (uint256[] memory) {
        Startup storage startup = startups[_startupId];
        
        // Count tokens for this investor
        uint256 tokenCount = 0;
        for (uint256 i = 0; i < startup.funders.length; i++) {
            if (startup.funders[i].funderAddress == _investor && !tokenBurned[startup.funders[i].tokenId]) {
                tokenCount++;
            }
        }
        
        // Create array of token IDs
        uint256[] memory tokens = new uint256[](tokenCount);
        uint256 index = 0;
        
        for (uint256 i = 0; i < startup.funders.length; i++) {
            if (startup.funders[i].funderAddress == _investor && !tokenBurned[startup.funders[i].tokenId]) {
                tokens[index] = startup.funders[i].tokenId;
                index++;
            }
        }
        
        return tokens;
    }

    // Withdraw funds from a startup campaign after the deadline has passed
    function withdrawFunds(uint256 _id) public {
        Startup storage startup = startups[_id];
        require(
            msg.sender == startup.owner,
            "Only the owner can withdraw funds"
        );
        require(
            block.timestamp > startup.deadline,
            "Cannot withdraw funds before the deadline"
        );
        require(
            startup.amountCollected >= startup.target,
            "Funding target not met"
        );

        // Calculate available funds (collected minus already released)
        uint256 availableFunds = startup.amountCollected - startup.amountReleased;
        require(availableFunds > 0, "No funds available to withdraw");

        // Update the released amount
        startup.amountReleased += availableFunds;

        // Transfer the funds
        (bool sent, ) = payable(startup.owner).call{value: availableFunds}("");
        require(sent, "Failed to send Ether");
    }

        // Refund if funding target is not met by deadline
    function refundInvestment(uint256 _startupId) public {
        Startup storage startup = startups[_startupId];
        require(
            block.timestamp > startup.deadline,
            "Cannot refund before deadline"
        );
        require(
            startup.amountCollected < startup.target,
            "Funding target was met, no refunds available"
        );
        
        // Find all investments by this investor
        uint256 totalInvestment = 0;
        uint256[] memory tokenIds = new uint256[](startup.funders.length);
        uint256 tokenCount = 0;
        
        for (uint256 i = 0; i < startup.funders.length; i++) {
            if (startup.funders[i].funderAddress == msg.sender) {
                totalInvestment += startup.funders[i].amount;
                tokenIds[tokenCount] = startup.funders[i].tokenId;
                tokenCount++;
            }
        }
        
        require(totalInvestment > 0, "No investment found for refund");
        
        // Burn all NFTs for this investor
        for (uint256 i = 0; i < tokenCount; i++) {
            if (_exists(tokenIds[i]) && !tokenBurned[tokenIds[i]]) {
                _burn(tokenIds[i]);
                tokenBurned[tokenIds[i]] = true;
                emit InvestmentNFTBurned(tokenIds[i]);
            }
        }
        
        // Refund the investment
        (bool sent, ) = payable(msg.sender).call{value: totalInvestment}("");
        require(sent, "Failed to send refund");
    }

    // Get the funders of a specific startup campaign
    function getFunders(uint256 _id) public view returns (Funder[] memory) {
        return startups[_id].funders;
    }

    // Get the equity holders of a specific startup
    function getEquityHolders(
        uint256 _id
    ) public view returns (EquityHolder[] memory) {
        return startups[_id].equityHolders;
    }

    // Get the documents of a specific startup
    function getStartupDocuments(uint256 _id) public view returns (Document[] memory) {
        return startups[_id].documentHashes;
    }

    // Get the milestones of a specific startup
    function getStartupMilestones(uint256 _id) public view returns (Milestone[] memory) {
        return startups[_id].milestones;
    }

    // Get all startups
    function getStartups() public view returns (Startup[] memory) {
        Startup[] memory allStartups = new Startup[](numberOfStartups);

        for (uint256 i = 0; i < numberOfStartups; i++) {
            Startup storage item = startups[i];
            allStartups[i] = item;
        }

        return allStartups;
    }

    // Create a new loan request
    function requestLoan(
        address _requester,
        string memory _name,
        string memory _purpose,
        uint256 _amount,
        uint256 _duration
    ) public returns (uint256) {
        LoanRequest storage loanRequest = loanRequests[numberOfLoans];

        loanRequest.requester = _requester;
        loanRequest.name = _name;
        loanRequest.purpose = _purpose;
        loanRequest.amount = _amount;
        loanRequest.duration = _duration;
        loanRequest.amountCollected = 0;
        loanRequest.repaid = false;

        numberOfLoans++;

        return numberOfLoans - 1;
    }

    // Add a document to a loan
    function addLoanDocument(
        uint256 _id,
        string memory _ipfsHash,
        string memory _documentType
    ) public {
        LoanRequest storage loanRequest = loanRequests[_id];
        require(
            msg.sender == loanRequest.requester || msg.sender == verifier,
            "Only the requester or verifier can add documents"
        );

        Document memory newDocument = Document({
            ipfsHash: _ipfsHash,
            documentType: _documentType,
            timestamp: block.timestamp
        });

        loanRequest.documentHashes.push(newDocument);
    }

    // Fund a loan request
    function fundLoan(uint256 _id) public payable {
        uint256 amount = msg.value;
        LoanRequest storage loanRequest = loanRequests[_id];

        require(
            loanRequest.amountCollected < loanRequest.amount,
            "Loan fully funded"
        );

        loanRequest.lenders.push(Funder(msg.sender, amount, 0)); // No NFT for loans
        loanRequest.amountCollected += amount;
    }

    // Withdraw loan funds by the requester
    function withdrawLoanFunds(uint256 _id) public {
        LoanRequest storage loanRequest = loanRequests[_id];
        require(
            msg.sender == loanRequest.requester,
            "Only the requester can withdraw funds"
        );
        require(
            loanRequest.amountCollected >= loanRequest.amount,
            "Loan target not met"
        );

        uint256 amount = loanRequest.amountCollected;
        loanRequest.amountCollected = 0;

        (bool sent, ) = payable(loanRequest.requester).call{value: amount}("");
        require(sent, "Failed to send Ether");
    }

    // Repay loan with interest
    function repayLoan(uint256 _id) public payable {
        LoanRequest storage loanRequest = loanRequests[_id];
        require(
            msg.sender == loanRequest.requester,
            "Only the requester can repay the loan"
        );
        require(!loanRequest.repaid, "Loan already repaid");

        uint256 repaymentAmount = loanRequest.amount +
            (loanRequest.amount / 10); // 10% interest
        require(msg.value >= repaymentAmount, "Insufficient repayment amount");

        loanRequest.repaid = true;

        for (uint256 i = 0; i < loanRequest.lenders.length; i++) {
            Funder storage lender = loanRequest.lenders[i];
            uint256 lenderAmount = lender.amount + (lender.amount / 10); // 10% interest to lenders

            (bool sent, ) = payable(lender.funderAddress).call{
                value: lenderAmount
            }("");
            require(sent, "Failed to repay lender");
        }
    }

    // Get the documents of a specific loan
    function getLoanDocuments(uint256 _id) public view returns (Document[] memory) {
        return loanRequests[_id].documentHashes;
    }

    // Get the lenders of a specific loan request
    function getLenders(uint256 _id) public view returns (Funder[] memory) {
        return loanRequests[_id].lenders;
    }

    // Get all loan requests
    function getLoanRequests() public view returns (LoanRequest[] memory) {
        LoanRequest[] memory allLoanRequests = new LoanRequest[](numberOfLoans);

        for (uint256 i = 0; i < numberOfLoans; i++) {
            LoanRequest storage item = loanRequests[i];
            allLoanRequests[i] = item;
        }

        return allLoanRequests;
    }
    
    // Get NFT metadata for a specific token
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");
        return super.tokenURI(tokenId);
    }
    
    // Check if an address owns any investment NFTs for a specific startup
    function hasInvestmentIn(address _investor, uint256 _startupId) public view returns (bool) {
        uint256[] memory tokens = getInvestorTokens(_investor, _startupId);
        return tokens.length > 0;
    }
    
    // Get total investment amount for an investor in a specific startup
    function getInvestmentAmount(address _investor, uint256 _startupId) public view returns (uint256) {
        return investorTotalAmount[_investor][_startupId];
    }
}
