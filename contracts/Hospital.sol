// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract HospitalRecords {

    struct Hospital {
        string hospitalName;
        string contactNum;
        string hospitalAddress;
        address addr;
        uint date;
    }

    address[] public hospitalList;
    mapping(address => Hospital) public hospitals; // Mapping to associate addresses with structs
    mapping(address => bool) public isHospital; //tracks of whether a specific Ethereum address is registered
    uint256 public hospitalCount = 0; // Total count of registered hospital
 

    function registerHospital(string memory _hospitalName, string memory _contactNum, string memory _hospitalAddress) public {
        require(!isHospital[msg.sender]);
        Hospital memory h = hospitals[msg.sender];
        h.hospitalName = _hospitalName;
        h.contactNum = _contactNum;
        h.hospitalAddress = _hospitalAddress;
        h.addr = msg.sender;
        h.date = block.timestamp;

        hospitalList.push(msg.sender);
        isHospital[msg.sender] = true;
        hospitalCount++;
    }

    function editHospitalProfile(string memory _hospitalName, string memory _contactNum, string memory _hospitalAddress) public {
        require(isHospital[msg.sender]);
        Hospital storage h = hospitals[msg.sender];
        
        h.hospitalName = _hospitalName;
        h.contactNum = _contactNum;
        h.hospitalAddress = _hospitalAddress;
    }

    function getHospitalList() public view returns (address[] memory) {
        return hospitalList;
    }

    function getHospitalCount() public view returns(uint256) {
        return hospitalCount;
    }
}
