// **************************************************************************
// Copyright 2016 Honeywell International Sàrl
// **************************************************************************
    'use strict';
    angular
        .module('accessControlComponentApp')
        .service('AccessControlSvc', ['AclService','$http',
            function AccessControlSvc(AclService,$http) {
                
                var accessControlApiURL = "";
                var self = this;
                var result={
                            "Version": "1.0.0.0",
                            "StatusCode": 200,
                            "Roles": [
                                {
                                "RoleDescription": "Security guards in an organization",
                                "RoleScope": "ORGANIZATIONAL",
                                "RoleName": "securityguard",
                                "Privileges": [
                                    {
                                    "PrivilegeName": "Read User Data",
                                    "PrivilegeDescription": "Assignees of this privilege will be able to read user data",
                                    "AppId": "",
                                    "PrivilegeTag": "readuserdata"
                                    }
                                ]
                                },
                                {
                                "RoleDescription": "Site administrators of a particular organization",
                                "RoleScope": "ORGANIZATIONAL",
                                "RoleName": "siteadmins",
                                "Privileges": [
                                    {
                                    "PrivilegeName": "read access",
                                    "PrivilegeDescription": "",
                                    "AppId": "",
                                    "PrivilegeTag": "read"
                                    },
                                    {
                                    "PrivilegeName": "Write Properties",
                                    "PrivilegeDescription": "Assignees of this privilege will be able to write properties",
                                    "AppId": "",
                                    "PrivilegeTag": "write"
                                    }
                                ]
                                }
                            ]
                            }

                self.isPrivilegesSet = false;
                self.setOrganizationPrivileges = setOrganizationPrivileges;
                self.setPrivileges = setPrivileges;  

                //AclService Methods
                self.attachRole = attachRole;
                self.setAbilities = setAbilities;
                self.can = can;
                
                
                function attachRole(role){
                    AclService.attachRole(role);
                }
                
                function setAbilities(abilities){
                    AclService.setAbilities(abilities);
                }

                function can(ability){
                    return AclService.can(ability);
                }

                var setRolesAndPrivileges = function(data){
                    var acl={};
                    var roles=[];
                    for(var i=0;i<data.Roles.length;i++){
                        var role = data.Roles[i];
                        roles.push(role.RoleName);
                        acl[role.RoleName]=[];
                        for(var j=0;j<role.Privileges.length;j++){
                            var privilege=role.Privileges[j];
                            acl[role.RoleName].push(privilege.PrivilegeTag);
                        }
                    }
                    self.isPrivilegesSet = true;
                    for(var i=0;i<roles.length;i++){
                        self.attachRole(roles[i])
                    }
                    self.setAbilities(acl);
                }

                function setPrivileges(accessControlApiURL) {
                    self.isPrivilegesSet = false;
                    if(accessControlApiURL){
                         $http({
                            method: 'GET',
                            url: accessControlApiURL
                        }).then(function(response) {
                            if (response.status == 200) {
                                // success
                                setRolesAndPrivileges(response.data);
                            } else {
                                // failed
                                console.log('Access privilege not set');
                            }
                        });
                    }else{
                         setRolesAndPrivileges(result);
                    }
                   
                }

                function setOrganizationPrivileges(org,accessControlApiURL){
                    self.isPrivilegesSet = false;
                    
                    $http({
                        method: 'GET',
                        url: accessControlApiURL,
                        headers: {
                            'OrganizationId':org.organizationId
                        }
                    }).then(function(response) {
                        if (response.status == 200) {
                            // success
                            setRolesAndPrivileges(response.data);
                        } else {
                            // failed
                            console.log('Access privilege not set');
                        }
                    });
                }
            }
        ]);
