pragma solidity ^0.4.10;

contract ProsperaToken {
/* Public variables of the token */
    string public standard = 'Token 0.1';
    string public name;
    string public symbol;
    uint8 public decimals;
    uint256 public totalSupply;

    /* This creates an array with all balances */
    mapping (address => uint256) public balanceOf;
    mapping (address => mapping (address => uint256)) public allowance;

    /* This generates a public event on the blockchain that will notify clients */
    event EtherTransfer(address indexed from, address indexed to, uint256 value);
    event Transfer(address indexed from, address indexed to, uint256 value);

    /* This notifies clients about the amount burnt */
    event Burn(address indexed from, uint256 value);


    function burn(uint256 _value) returns (bool success) {
        if (balanceOf[msg.sender] < _value) throw;                 // Check if the sender has enough
        balanceOf[msg.sender] -= _value;                          // Subtract from the sender
        Burn(msg.sender, _value);
        return true;
    }


    /* Notifies when funds were added */
    event SplitFundsEvent(address indexed addedBy, uint256 indexed value);

    event MintEvent(address participant, uint256 indexed value);

    address[] public participants;

    function ProsperaToken(
        uint256 initialSupply,
        string tokenName,
        uint8 decimalUnits,
        string tokenSymbol
        ) {
        balanceOf[msg.sender] = initialSupply;
        participants.push(msg.sender);

        totalSupply = initialSupply;
        name = tokenName;
        symbol = tokenSymbol;
        decimals = decimalUnits;
    }

    /* Send coins */
    function transfer(address _to, uint256 _value) {
        if (_to == 0x0) throw;                               // Prevent transfer to 0x0 address
        if (balanceOf[msg.sender] < _value) throw;           // Check if the sender has enough
        if (balanceOf[_to] + _value < balanceOf[_to]) throw; // Check for overflows
        balanceOf[msg.sender] -= _value;                     // Subtract from the sender

        participants.push(_to);

        balanceOf[_to] += _value;                            // Add the same to the recipient
        Transfer(msg.sender, _to, _value);                   // Notify anyone listening that this transfer took place
    }

    // @method splitFunds
    // Splits funds between participants
    function splitFunds() payable returns (bool success) {
        uint256 i;
        uint256 sharePct;
        for(i = 0; i < participants.length; i++){
            sharePct = calculateSharePercentage(participants[i]);
            uint value = msg.value * sharePct / 100;
            if (!participants[i].send(value)) throw;
            EtherTransfer(msg.sender, participants[i], msg.value * sharePct);
        }
        SplitFundsEvent(msg.sender, msg.value);
        return true;
    }

    function calculateSharePercentage(address participant) constant returns (uint256 shareSize) {
        return balanceOf[participant] * 100 / totalSupply;
    }

    function emissionRate(uint256 x) constant returns (uint256 er) {
        // return uint8(100) * uint8(10) ** decimals;
        return 100 * 1000;
    }

    modifier withTimeAllowance () {
        _;
    }

    function mint () withTimeAllowance returns (bool success) {
        uint256 additionalSupply = emissionRate(totalSupply);
        uint256 sharePct;
        uint256 value;
        for(uint256 i = 0; i < participants.length; i = i + 1){
            sharePct = calculateSharePercentage(participants[i]);
            value = sharePct * additionalSupply / 100;
            balanceOf[participants[i]] += value;
            MintEvent(participants[i], value);
        }

        totalSupply += additionalSupply;
        return true;
    }
}
