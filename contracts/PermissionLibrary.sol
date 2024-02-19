// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

library PermissionLibrary {

    function givePermission(mapping(address => mapping(address => bool)) storage isApproved, address owner, address _address) internal {
        isApproved[owner][_address] = true;
    }

    function revokePermission(mapping(address => mapping(address => bool)) storage isApproved, address owner, address _address) internal {
        isApproved[owner][_address] = false;
    }

    function getAllAuthorizedHospitals(mapping(address => mapping(address => bool)) storage isApproved, address owner, address[] memory patientList) internal view returns (address[] memory) {
        uint256 permissionGrantedCount = 0;

        for (uint256 i = 0; i < patientList.length; i++) {
            address hospitalAddress = patientList[i];
            if (isApproved[owner][hospitalAddress]) {
                permissionGrantedCount++;
            }
        }

        address[] memory authorizedHospitals = new address[](permissionGrantedCount);
        uint256 index = 0;

        for (uint256 i = 0; i < patientList.length; i++) {
            address hospitalAddress = patientList[i];
            if (isApproved[owner][hospitalAddress]) {
                authorizedHospitals[index] = hospitalAddress;
                index++;
            }
        }
        return authorizedHospitals;
    }
}
