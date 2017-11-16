define(['app/topology/topology.module'], function(topology) {

    topology.register.factory('TopologyRestangular', function(Restangular, ENV) {
        return Restangular.withConfig(function(RestangularConfig) {
            RestangularConfig.setBaseUrl(ENV.getBaseURL("MD_SAL"));
        });
    });

    topology.register.factory('tunnelTopologySvc', function(TopologyRestangular) {
        var svc = {
            base: function() {
                return TopologyRestangular.one('restconf').one('operational').one('sdn-tunnel-topology:sdn-tunnel-topology');
            },
            CONST: {
                TUNNEL: "tunnel-links",
                TUNNEL_ID: "tunnel-id",
                TUNNEL_NAME: "tunnel-name",
                LSP: "lsp",
                LSP_ID: "lsp-id",
                SOURCE_NODE: "source-node",
                DES_NODE: "des-node",
                LSP_ROLE: "lsp-role",
                LINKS: "links",
                LEFT_NODE: "left-node",
                RIGHT_NODE: "right-node",
                LEFT_LTP: "left-ltp",
                RIGHT_LTP: "right-ltp",
                STATUS: "status",
                LEFT_IP: "left-ip",
                RIGHT_IP: "right-ip"
            }
        };

        svc.getAllTunnel = function(cb) {
            var nodes = [];
            var links = [];

            var isNodeExit = function(nodes, nodeId) {
                var flag = false;
                angular.forEach(nodes, function(data) {
                    console.log(data);
                    console.log(nodeId);
                    if (data.id === nodeId) {
                        flag = true;
                    } else {

                    }
                });
                return flag;
            };

            return svc.base().get().then(function(ntData) {
                var aaaa = TopologyRestangular.configuration.baseUrl;
                var pp = "sdn-tunnel-topology";
                var p = 'tunnel-links';
                if (ntData) {
                    console.log(ntData);
                    angular.forEach((ntData[pp][p]), function(nodeData) {

                        var tunnelId = nodeData[svc.CONST.TUNNEL_ID];
                        var tunnelName = nodeData[svc.CONST.TUNNEL_NAME];
                        var tunnelleft = nodeData[svc.CONST.LEFT_NODE];
                        var tunnelright = nodeData[svc.CONST.RIGHT_NODE];
                        var tunnelleftip = nodeData[svc.CONST.LEFT_IP];
                        var tunnelrightip = nodeData[svc.CONST.RIGHT_IP];
                        var status = "";
                        var flag = 0;

                        var checkresult;

                        /*
                        //检测lsp是否都是通得
                        TopologyRestangular.one('restconf').one('operations').post('sal-netconf:oam-status', '{"input": {"tunnel-id":' + tunnelId + '}}').then(function(data) {
                            checkresult = data.output['enable-oam-result'];
                            if (checkresult) {
                                var aaa = 0;
                                angular.forEach((data.output['lsp-oam']), function(oamdata) {
                                    if (flag < 2) {
                                        if (!oamdata['MEP_CCM_Database'][0]) {
                                            aaa++;
                                            flag++;
                                        } else {
                                            flag++;
                                        }

                                    }
                                });

                                if (flag === 1) {
                                    if (aaa === 0) {
                                        status += 1;
                                    } else {
                                        status += 3;
                                    }
                                } else {
                                    if (aaa === 0) {
                                        status += 12;
                                    }
                                    if (aaa === 1) {
                                        status += 13;
                                    }
                                    if (aaa === 2) {
                                        status += 33;
                                    }
                                }

                            }
                        });
                        */



                        $.ajax({
                            type: "post",
                            contentType: 'application/json',
                            url: aaaa + "/restconf/operations/sal-netconf:oam-status",
                            data: '{"input": {"tunnel-id":' + tunnelId + '}}',
                            async: false,
                            success: function(data) {
                                checkresult = data.output['enable-oam-result'];
                                if (checkresult) {
                                    var aaa = 0;
                                    angular.forEach((data.output['lsp-oam']), function(oamdata) {
                                        if (flag < 2) {
                                            if (!oamdata['MEP_CCM_Database'][0]) {
                                                aaa++;
                                                flag++;
                                            } else {
                                                flag++;
                                            }

                                        }
                                    });

                                    if (flag === 1) {
                                        if (aaa === 0) {
                                            status += 1;
                                        } else {
                                            status += 3;
                                        }
                                    } else {
                                        if (aaa === 0) {
                                            status += 12;
                                        }
                                        if (aaa === 1) {
                                            status += 13;
                                        }
                                        if (aaa === 2) {
                                            status += 33;
                                        }
                                    }

                                }
                            },
                            error: function(e) {
                                var ee = e;
                            }
                        });





                        if (!checkresult) {
                            //暂时tunnel的tip显示，假设最多只有两条lsp,
                            angular.forEach((nodeData[svc.CONST.LSP]), function(lspData) {
                                if (flag < 2) {
                                    if (lspData[svc.CONST.STATUS] === "中断") {
                                        status += 3;
                                    } else if (lspData[svc.CONST.STATUS] === "保护") {
                                        status += 2;
                                    } else {
                                        status += 1;
                                    }
                                    flag++;
                                }
                            });
                        }

                        var tips = '<image src="assets/images/tunnel-tips/' + status + '.jpg"></image>';
                        /*
                angular.forEach((nodeData[svc.CONST.LSP]),function(lspData){
                        var lspId=lspData[svc.CONST.LSP_ID];
                        var sourceNode=lspData[svc.CONST.SOURCE_NODE];
                        var desNode=lspData[svc.CONST.DES_NODE];
                        var lspRole=lspData[svc.CONST.LSP_ROLE];
                        var sd=sourceNode+desNode;

                        var tunneltitle='tunnel ID:  <font color="#fff">'+tunnelId+'</font><br> Name:  <font color="#fff">'+tunnelName+'</font><br> Left Node:  <font color="#fff">'+sourceNode+'</font><br> Right Node:  <font color="#fff">'+desNode+'</font>';
                        if(!isNodeExit(nodes,(tunnelId+"-"+sourceNode))){
                            nodes.push({'id':tunnelId+"-"+sourceNode,group:'switch',value:20,'tunnelid':tunnelId,'tunnelname':tunnelName,title:tunneltitle});
                        }

                        if(!isNodeExit(nodes,(tunnelId+"-"+desNode))){
                            nodes.push({'id':tunnelId+"-"+desNode, group: 'switch',value:20,'tunnelid':tunnelId,'tunnelname':tunnelName,title:tunneltitle});
                        }
                        
                        links.push({'id':tunnelId+"-"+lspId, 'from':tunnelId+"-"+sourceNode,'to':tunnelId+"-"+desNode,'tunnelname':tunnelName,'tunnelid':tunnelId,title:'LSP ID:  <font color="#fff">'+lspId+'</font><br> LSP Role:  <font color="#fff">'+lspRole+'</font>'});
                });
                */
                        if (!isNodeExit(nodes, tunnelleft)) {
                            nodes.push({ 'id': tunnelleft, 'label': "Raisecom:" + tunnelleftip, group: 'switch', value: 20 });
                        }
                        if (!isNodeExit(nodes, tunnelright)) {
                            nodes.push({ 'id': tunnelright, 'label': "Raisecom:" + tunnelrightip, group: 'switch', value: 20 });
                        }
                        if (flag < 2) {
                            links.push({ 'id': tunnelId, width: 8, 'from': tunnelleft, 'to': tunnelright, sd: tunnelleft + tunnelright, 'tunnelname': tunnelName, 'tunnelid': tunnelId });
                        } else {
                            links.push({ 'id': tunnelId, width: 8, 'from': tunnelleft, 'to': tunnelright, sd: tunnelleft + tunnelright, 'tunnelname': tunnelName, 'tunnelid': tunnelId, title: tips });
                        }
                    });

                }
                var data = {
                    "nodes": nodes,
                    "links": links
                };
                cb(data);
            });

        };

        svc.getLspLinks = function(tunnelId, lspId, cb) {
            var nodes = [];
            var links = [];
            var isNodeExit = function(nodes, nodeId) {
                var flag = false;
                angular.forEach(nodes, function(data) {
                    console.log(data);
                    console.log(nodeId);
                    if (data.id === nodeId) {
                        flag = true;
                    } else {

                    }
                });
                return flag;
            };
            return svc.base().one('tunnel-links', tunnelId).get().then(function(ntData) {
                var aaaa = TopologyRestangular.configuration.baseUrl;
                var h = "tunnel-links";
                if (ntData[h][0][svc.CONST.LSP]) {
                    angular.forEach(ntData[h][0][svc.CONST.LSP], function(nodeData) {
                        var id = nodeData[svc.CONST.LSP_ID];
                        var leftNode = nodeData[svc.CONST.SOURCE_NODE];
                        var rightNode = nodeData[svc.CONST.DES_NODE];
                        var role = nodeData[svc.CONST.LSP_ROLE];
                        var status = nodeData[svc.CONST.STATUS];
                        var color = "green";

                        var down = false;
                        //检测lsp是否是通得
                        $.ajax({
                            type: "post",
                            contentType: 'application/json',
                            url: aaaa + "/restconf/operations/sal-netconf:oam-status",
                            data: '{"input": {"tunnel-id":' + tunnelId + '}}',
                            async: false,
                            success: function(data) {
                                var check = data.output['enable-oam-result'];
                                if (check) {
                                    angular.forEach((data.output['lsp-oam']), function(oamdata) {
                                        if (id === oamdata['lsp-key'] && oamdata['MEP_CCM_Database'][0]['rMepState'] !== 'Ok') {
                                            status = "中断";
                                            down = true;
                                        }

                                    });
                                }
                            }

                        });

                        //检测主备
                        if (!down) {
                            //检测工作在哪一条lsp
                            $.ajax({
                                type: "post",
                                contentType: 'application/json',
                                url: aaaa + "/restconf/operations/sal-vpws:protection-status",
                                data: '{"input": {"service-id":' + tunnelId + '}}',
                                async: false,
                                success: function(data) {
                                    if (data.output.result) {
                                        if (!data.output.master) {
                                            if (role === "master") {
                                                status = "保护";
                                            } else {
                                                status = "工作";
                                            }
                                        }
                                    }
                                }

                            });
                        }
                        if (status === "中断") {
                            color = "red";
                        } else if (status === "保护") {
                            color = "orange";
                        } else {

                        }

                        angular.forEach(nodeData['links'], function(data) {
                            var left = data[svc.CONST.LEFT_NODE];
                            var right = data[svc.CONST.RIGHT_NODE];
                            if (!isNodeExit(nodes, left)) {
                                nodes.push({ 'id': left, 'label': "Raisecom:" + leftip, group: 'switch', value: 20 });
                            }
                            if (!isNodeExit(nodes, right)) {
                                nodes.push({ 'id': right, 'label': "Raisecom:" + rightip, group: 'switch', value: 20 });
                            }
                            links.push({ from: left, to: right, 'color': color });

                        });

                    });
                }
                var data = {
                    "nodes": nodes,
                    "links": links
                };
                cb(data);
            });
        };


        return svc;
    });


    topology.register.factory('PwTopologySvc', ['$filter', 'TopologyRestangular', function($filter, TopologyRestangular) {
        var svc = {
            base: function() {
                return TopologyRestangular.one('restconf').one('operational').one('sdn-pw-topology:sdn-pw-topology');
            },
            CONST: {
                PW: "pw-links",
                ID: "pw-id",
                NAME: "name",
                USER_LABEL: "user-label",
                OPERATE_STATUS: "operate-status",
                ADMIN_STATUS: "admin-status",
                LEFT_NODE: "left-node",
                RIGHT_NODE: "right-node",
                A2ZCIR: "qos-a2z-cir",
                A2ZPIR: "qos-a2z-pir",
                A2ZCBS: "qos-a2z-cbs",
                A2ZPBS: "qos-a2z-pbs",
                Z2ACIR: "qos-z2a-cir",
                Z2APIR: "qos-z2a-pir",
                Z2ACBS: "qos-z2a-cbs",
                Z2APBS: "qos-z2a-pbs",
                LEFT_VLAN: "left-vlan",
                RIGHT_VLAN: "right-vlan",
                LEFT_LTP: "left-ltp",
                RIGHT_LTP: "right-ltp",
                LEFT_IP: "left-ip",
                RIGHT_IP: "right-ip"

            }
        };

        svc.getAllPw = function(cb) {
            var nodes = [];
            var links = [];

            var isNodeExit = function(nodes, nodeId) {
                var flag = false;
                angular.forEach(nodes, function(data) {
                    console.log(data);
                    console.log(nodeId);
                    if (data.id === nodeId) {
                        flag = true;
                    } else {

                    }
                });
                return flag;
            };

            return svc.base().get().then(function(ntData) {
                var pp = "sdn-pw-topology";
                var p = 'pw-links';
                if (ntData) {
                    console.log(ntData[pp][p]);
                    angular.forEach((ntData[pp][p]), function(nodeData) {
                        console.log(nodeData[svc.CONST.PW]);
                        var pwId = nodeData[svc.CONST.ID];
                        var leftNode = nodeData[svc.CONST.LEFT_NODE];
                        var rightNode = nodeData[svc.CONST.RIGHT_NODE];
                        var a2zcir = nodeData[svc.CONST.A2ZCIR];
                        var a2zpir = nodeData[svc.CONST.A2ZPIR];
                        var a2zcbs = nodeData[svc.CONST.A2ZCBS];
                        var a2zpbs = nodeData[svc.CONST.A2ZPBS];
                        var z2acir = nodeData[svc.CONST.Z2ACIR];
                        var z2apir = nodeData[svc.CONST.Z2APIR];
                        var z2acbs = nodeData[svc.CONST.Z2ACBS];
                        var z2apbs = nodeData[svc.CONST.Z2APBS];
                        var leftvlan = nodeData[svc.CONST.LEFT_VLAN];
                        var rightvlan = nodeData[svc.CONST.RIGHT_VLAN];
                        var leftltp = leftNode + ":" + nodeData[svc.CONST.LEFT_LTP];
                        var rightltp = rightNode + ":" + nodeData[svc.CONST.RIGHT_LTP];
                        var leftip = nodeData[svc.CONST.LEFT_IP];
                        var rightip = nodeData[svc.CONST.RIGHT_IP];
                        var userLabel = nodeData[svc.CONST.USER_LABEL];
                        var srctitle = 'Left:&nbsp;CIR: <font color="#fff">' + a2zcir + '</font>(Kbps) &nbsp;CBS: <font color="#fff">' + a2zcbs + '</font>(Kbytes) &nbsp; PIR: <font color="#fff">' + a2zpir + '</font>(Kbps) &nbsp; PBS: <font color="#fff">' + a2zpbs + '</font>(Kbytes) <br> ';
                        var destitle = 'Right:&nbsp;CIR: <font color="#fff">' + z2acir + '</font>(Kbps) &nbsp;CBS: <font color="#fff">' + z2acbs + '</font>(Kbytes) &nbsp; PIR: <font color="#fff">' + z2apir + '</font>(Kbps) &nbsp; PBS: <font color="#fff">' + z2apbs + '</font>(Kbytes) <br> ';

                        var pwtitle = 'PW ID:  <font color="#fff">' + pwId + '</font>&nbsp;  ' + $filter('translate')('User Label') + ':  <font color="#fff">' + userLabel + '</font><br>' + $filter('translate')('Left Ltp') + ':  <font color="#fff">' + leftltp + '</font>&nbsp;  ' + $filter('translate')('Right Ltp') + ':  <font color="#fff">' + rightltp + '</font><br> Left Vlan:  <font color="#fff">' + leftvlan + '</font>&nbsp;  Right Vlan:  <font color="#fff">' + rightvlan + '</font><br>' + srctitle + destitle;
                        if (!isNodeExit(nodes, leftNode)) {
                            nodes.push({ 'id': leftNode, 'label': 'Raisecom:' + leftip, group: 'switch', value: 20, 'userlabel': userLabel, 'pwid': pwId });
                        }
                        if (!isNodeExit(nodes, rightNode)) {
                            nodes.push({ 'id': rightNode, 'label': 'Raisecom:' + rightip, group: 'switch', value: 20, 'userlabel': userLabel, 'pwid': pwId });
                        }

                        links.push({ id: pwId, sd: leftNode + rightNode, 'from': leftNode, 'to': rightNode, 'userlabel': userLabel, title: pwtitle, width: 8 });
                    });

                }
                var data = {
                    "nodes": nodes,
                    "links": links
                };
                cb(data);
            });

        };

        svc.getPwInfo = function(pwId, cb) {

            return svc.base().one('pw-links', pwId).get().then(function(ntData) {
                if (ntData && ntData[svc.CONST.PW][0]) {
                    pwData = ntData[svc.CONST.PW][0];
                    var data = "<table>";
                    var pwIdInfo = "<tr><td>pw-id</td><input type='text' readonly='readonly' /></td></tr>";
                    if (pwData[svc.CONST.ID] !== undefined) {
                        pwIdInfo = "<tr><td>pw-id</td><td><input type='text' readonly='readonly' value='" + pwData[svc.CONST.ID] + "' /></td></tr>";
                    }
                    data += pwIdInfo;

                    var name = "<tr><td>pw-name</td><input type='text' readonly='readonly' /></td></tr>";
                    if (pwData[svc.CONST.NAME] !== undefined) {
                        name = "<tr><td>pw-name</td><td><input type='text' readonly='readonly' value='" + pwData[svc.CONST.NAME] + "' /></td></tr>";
                    }
                    data += name;

                    var userLabel = "<tr><td>" + $filter('translate')('user-label') + "</td><input type='text' readonly='readonly' /></td></tr>";
                    if (pwData[svc.CONST.USER_LABEL] !== undefined) {
                        userLabel = "<tr><td>" + $filter('translate')('user-label') + "</td><td><input type='text' readonly='readonly' value='" + pwData[svc.CONST.USER_LABEL] + "' /></td></tr>";
                    }
                    data += userLabel;


                    var leftNode = "<tr><td>" + $filter('translate')('left-node') + "</td><input type='text' readonly='readonly' /></td></tr>";
                    if (pwData[svc.CONST.LEFT_NODE] !== undefined) {
                        leftNode = "<tr><td>" + $filter('translate')('left-node') + "</td><td><input type='text' readonly='readonly' value='" + pwData[svc.CONST.LEFT_NODE] + "' /></td></tr>";
                    }
                    data += leftNode;

                    var rightNode = "<tr><td>" + $filter('translate')('right-node') + "</td><input type='text' readonly='readonly' /></td></tr>";
                    if (pwData[svc.CONST.RIGHT_NODE] !== undefined) {
                        rightNode = "<tr><td>" + $filter('translate')('right-node') + "</td><td><input type='text' readonly='readonly' value='" + pwData[svc.CONST.RIGHT_NODE] + "' /></td></tr>";
                    }
                    data += rightNode;

                    var operateStatus = "<tr><td>" + $filter('translate')('operate-status') + ":</td><td><input type='text'/></td></tr>";
                    if (pwData[svc.CONST.OPERATE_STATUS] !== undefined) {
                        operateStatus = "<tr><td>" + $filter('translate')('operate-status') + ":</td><td><input type='text' value='" + pwData[svc.CONST.OPERATE_STATUS] + "' /></td></tr>";
                    }
                    data += operateStatus;

                    var adminStatus = "<tr><td>" + $filter('translate')('admin-status') + ":</td><td><input type='text' /></td></tr>";
                    if (pwData[svc.CONST.ADMIN_STATUS] !== undefined) {
                        adminStatus = "<tr><td>" + $filter('translate')('admin-status') + ":</td><td><input type='text' value='" + pwData[svc.CONST.ADMIN_STATUS] + "' /></td></tr>";

                    }
                    data += adminStatus;

                    cb(data);
                }



            });
        };

        return svc;
    }]);


    topology.register.factory('SptnDelSvc', function($state, TopologyRestangular) {
        var svc = {
            base: function() {
                return TopologyRestangular.one('restconf').one('operations');
            }
        };
        svc.deleteFilterNodes = function(nodeids) {

            $.ajax({
                url: TopologyRestangular.configuration.baseUrl + "/restconf/operations/sptn-net-topology:delete-down-nodes",
                contentType: "application/json",
                type: "post",
                async: false,
                data: JSON.stringify({ input: nodeids }),
                dataType: "json",
                success: function(response) {
                    console.log("commit success!");
                    console.log(response);
                },
                error: function(response) {
                    console.log(response);
                    console.log("Error with status code " + response.status);
                }
            });

        };
        return svc;
    });



    topology.register.factory('SptnTopologySvc', ['$filter', '$state', 'TopologyRestangular', function($filter, $state, TopologyRestangular) {
        var LEFT_LTP_NAME;
        var RIGHT_LTP_NAME;
        var svc = {
            base: function() {
                return TopologyRestangular.one('restconf').one('operational').one('sptn-net-topology:net-topology');
            },
            base2: function() {
                return TopologyRestangular.one('restconf').one('operations');
            },
            CONST: {
                ID: "id",
                NAME: "name",
                USER_LABEL: "user-label",
                PARENT_TOPO_ID: "parent-topo-id",
                NODE_TYPE: "node-type",
                OPERATE_STATUS: "operate-status",
                ADMIN_STATUS: "admin-status",
                RESOURCE_ID: "resource-id",
                LEFT_NODE_ID: "left-node-id",
                LEFT_LTP_ID: "left-ltp-id",
                RIGHT_NODE_ID: "right-node-id",
                RIGHT_LTP_ID: "right-ltp-id",
                LEFT_LTP_MAC: "left-ltp-mac",
                RIGHT_LTP_MAC: "right-ltp-mac",
                LINK_RUN: "link-te-attr-run",
                AVAILABLE_BANDWIDTH: "available-bandwidth",
                LINK_LATENCY: "link-latency",
                PHYSICAL_BANDWIDTH: "physical-bandwidth",
                LINK_CFG: "link-te-attr-cfg",
                LATENCY: "latency",
                MAX_RESERVABLE_BANDWIDTH: "max-reservable-bandwidth"
            }
        };

        svc.getDeviceType = function(cb) {
            svc.base2().post('topology-display:get-all-device-types', { input: {} }).then(function(data) {
                    if (data && data['output']) {
                        var type = [];
                        angular.forEach(data['output']['device-type'], function(item, index) {
                            var oneData = {
                                type: item,
                                value: item
                            };
                            type.push(oneData);
                        });

                        cb(type);
                    }
                },
                function(response) {
                    cb('error');
                });
        };

        svc.getDeviceIcons = function(input, cb) {
            svc.base2().post('topology-display:get-all-device-icons', { input: input }).then(function(data) {
                    if (data && data['output']) {
                        if (data['output']) {
                            cb(data['output']);
                        }
                    }
                },
                function(response) {
                    cb('error');
                });
        };

        svc.updateDeviceIcons = function(input, cb) {
            svc.base2().post('topology-display:update-device-icon-by-device-type', { input: input }).then(function(data) {
                    cb('success');
                },
                function(response) {
                    cb('error');
                });
        };

        svc.getAllIconNodes = function(type, cb) {
            $.ajax({
                url: TopologyRestangular.configuration.baseUrl + "/restconf/operations/sptn-net-topology:get-all-linktopo-info",
                contentType: "application/json",
                type: 'post',
                async: false,
                dataType: "json",
                data: JSON.stringify({ input: {} }),
                success: function(data) {
                    if (data && data['output']) {
                        var nodeList = data['output']['nodes'];
                        //对原生数据进行处理
                        angular.forEach(nodeList, function(node) {
                            var nodeId = node.id;
                            var name = node['name'];
                            var status = node['operate-status'];
                            var parentTopoId = node['parent-topo-id'];
                            var userLabel = node['user-label'];
                            if (userLabel === undefined) {
                                userLabel = "";
                            }

                            if (type == 'name') {
                                node.label = name;
                            } else if (type == 'userlabel') {
                                node.label = userLabel;
                            }

                            node.size = 20;

                            var nodePos = svc.getNodePosById(node.id);

                            if (nodePos !== "") {
                                node.x = nodePos.x;
                                node.y = nodePos.y;
                            }

                            node.title = $filter('translate')('Node ID') + ':  ' + name + '<br>' +
                                $filter('translate')('User Label') + ':  ' + userLabel + '<br>' +
                                $filter('translate')('Parent Topo ID') + ':  ' + parentTopoId + '<br>' +
                                $filter('translate')('Operate Status') + ':  ' + $filter('translate')(status);

                            // if(node["operate-status"] === "operate-up"){
                            //     node.group = "node-up";
                            // }else if(node["operate-status"] === "operate-down"){
                            //     node.group = "node-down";
                            // }else if(node["operate-status"] === "power-lost"){
                            //     node.group = "node-lost";
                            // }else{
                            //     node.group = "node-unkown";
                            // }

                            node.image = 'assets/images/' + node.icon + '.png';
                            node.shape = 'image';
                            node.userlabel = userLabel;

                        });
                        cb(data['output']['nodes']);
                    }
                },
                failure: function(response) {
                    console.log($filter('translate')('Error with status code:') + response.status);
                }
            });
        };

        //获取特定节点的基本信息
        svc.getNodeInfo = function(nodeId, info) {

            var nodeData = "";

            $.ajax({
                url: TopologyRestangular.configuration.baseUrl + "/restconf/operational/sptn-net-topology:net-topology/nodes/node/" + nodeId,
                type: "get",
                async: false,
                success: function(response) {
                    console.log(response);
                    if (response['node'][0] !== undefined) {
                        nodeData = response['node'][0];
                    }
                }
            });

            $.ajax({
                url: TopologyRestangular.configuration.baseUrl + "/restconf/operational/sptn-net-topology:net-topology/ext-nodes/ext-node/" + nodeId,
                type: "get",
                async: false,
                success: function(response) {
                    console.log(response);
                    if (response['ext-node'][0] !== undefined) {
                        nodeData = response['ext-node'][0];
                    }
                }
            });

            if (nodeData !== "") {
                info(nodeData);
            }

        };

        //获取特定链路的基本信息
        svc.getLinkInfo = function(linkId, info) {

            var linkData = "";

            $.ajax({
                url: TopologyRestangular.configuration.baseUrl + "/restconf/operational/sptn-net-topology:net-topology/links/link/" + linkId,
                type: "get",
                async: false,
                success: function(response) {
                    console.log(response);
                    if (response['link'][0] !== undefined) {
                        linkData = response['link'][0];
                    }
                }
            });

            $.ajax({
                url: TopologyRestangular.configuration.baseUrl + "/restconf/operational/sptn-net-topology:net-topology/ext-links/ext-link/" + linkId,
                type: "get",
                async: false,
                success: function(response) {
                    console.log(response);
                    if (response['ext-link'][0] !== undefined) {
                        linkData = response['ext-link'][0];
                    }
                }
            });

            if (linkData !== "") {

                var data = "<table>";

                var id = "<tr><td>ID&nbsp;:&nbsp;</td><td><input type='text' readonly='readonly' /></td>";
                if (linkData[svc.CONST.ID] !== undefined) {
                    id = "<tr><td>ID&nbsp;:&nbsp;</td><td><input type='text' readonly='readonly' value='" + linkData[svc.CONST.ID] + "' /></td>";
                }
                //data += id;


                var name = "<td>&nbsp;&nbsp;" + $filter('translate')('Name') + "&nbsp;:&nbsp;</td><td><input type='text' /></td></tr>";
                if (linkData[svc.CONST.NAME] !== undefined) {
                    name = "<td>&nbsp;&nbsp;" + $filter('translate')('Name') + "&nbsp;:&nbsp;</td><td><input type='text' value='" + linkData[svc.CONST.NAME] + "' /></td></tr>";
                }
                data += name;

                var parentTopoId = "<tr><td>" + $filter('translate')('Parent Topo Id') + "&nbsp;:&nbsp;</td><td><input type='text' readonly='readonly' /></td>";
                if (linkData[svc.CONST.PARENT_TOPO_ID] !== undefined) {
                    parentTopoId = "<tr><td>" + $filter('translate')('Parent Topo Id') + "&nbsp;:&nbsp;</td><td><input type='text' readonly='readonly' value='" + linkData[svc.CONST.PARENT_TOPO_ID] + "' /></td>";
                }
                data += parentTopoId;

                var adminStatus = "<td>&nbsp;&nbsp;" + $filter('translate')('Admin Status') + "&nbsp;:&nbsp;</td><td><input type='text' readonly='readonly'/></td></tr>";
                if (linkData[svc.CONST.ADMIN_STATUS] !== undefined) {
                    adminStatus = "<td>&nbsp;&nbsp;" + $filter('translate')('Admin Status') + "&nbsp;:&nbsp;</td><td><input type='text' readonly='readonly' value='" + linkData[svc.CONST.ADMIN_STATUS] + "' /></td></tr>";

                }
                data += adminStatus;

                var operateStatus = "<tr><td>" + $filter('translate')('Operate Status') + "&nbsp;:&nbsp;</td><td><input type='text' readonly='readonly'/></td>";
                if (linkData[svc.CONST.OPERATE_STATUS] !== undefined) {
                    operateStatus = "<tr><td>" + $filter('translate')('Operate Status') + "&nbsp;:&nbsp;</td><td><input type='text' readonly='readonly' value='" + linkData[svc.CONST.OPERATE_STATUS] + "' /></td>";
                }
                data += operateStatus;

                // var leftNodeId = "<td>&nbsp;&nbsp;"+$filter('translate')('Left Node')+"&nbsp;:&nbsp;</td><td><input type='text' readonly='readonly'/></td></tr>";
                // if(linkData[svc.CONST.LEFT_NODE_ID] !== undefined){
                //     leftNodeId = "<td>&nbsp;&nbsp;"+$filter('translate')('Left Node')+"&nbsp;:&nbsp;</td><td><input type='text' readonly='readonly' value='"+linkData[svc.CONST.LEFT_NODE_ID]+"' /></td></tr>";
                // }
                // data += leftNodeId;

                var leftNodeUserlabel = "<td>&nbsp;&nbsp;" + $filter('translate')('Left Node') + "&nbsp;:&nbsp;</td><td><input type='text' readonly='readonly'/></td></tr>";
                if (linkData['left-node-user-label'] !== undefined) {
                    leftNodeUserlabel = "<td>&nbsp;&nbsp;" + $filter('translate')('Left Node') + "&nbsp;:&nbsp;</td><td><input type='text' readonly='readonly' value='" + linkData['left-node-user-label'] + "' /></td></tr>";
                }
                data += leftNodeUserlabel;


                // var rightNodeId = "<tr><td>"+$filter('translate')('Right Node')+"&nbsp;:&nbsp;</td><td><input type='text' readonly='readonly'/></td>";
                // if(linkData[svc.CONST.RIGHT_NODE_ID] !== undefined){
                //     rightNodeId = "<tr><td>"+$filter('translate')('Right Node')+"&nbsp;:&nbsp;</td><td><input type='text' readonly='readonly' value='"+linkData[svc.CONST.RIGHT_NODE_ID]+"' /></td>";

                // }
                // data += rightNodeId;

                var rightNodeUserlabel = "<tr><td>" + $filter('translate')('Right Node') + "&nbsp;:&nbsp;</td><td><input type='text' readonly='readonly'/></td>";
                if (linkData['right-node-user-label'] !== undefined) {
                    rightNodeUserlabel = "<tr><td>" + $filter('translate')('Right Node') + "&nbsp;:&nbsp;</td><td><input type='text' readonly='readonly' value='" + linkData['right-node-user-label'] + "' /></td>";

                }
                data += rightNodeUserlabel;


                // var leftLtp = "<td>&nbsp;&nbsp;"+$filter('translate')('Left LTP')+"&nbsp;:&nbsp;</td><td><input type='text' readonly='readonly'/></td></tr>";
                // if(linkData[svc.CONST.LEFT_LTP_ID] !== undefined){
                //     var leftLtpId = linkData[svc.CONST.LEFT_LTP_ID];
                //     var leftLtpNo = leftLtpId.substring(leftLtpId.lastIndexOf(":")+1);
                //     if(leftLtpNo !== undefined){
                //         leftLtp = "<td>&nbsp;&nbsp;"+$filter('translate')('Left LTP')+"&nbsp;:&nbsp;</td><td><input type='text' readonly='readonly' value='"+leftLtpNo+"' /></td></tr>";
                //     }
                // }
                // data += leftLtp;

                var leftLtpUserlabel = "<td>&nbsp;&nbsp;" + $filter('translate')('Left LTP') + "&nbsp;:&nbsp;</td><td><input type='text' readonly='readonly'/></td></tr>";
                if (linkData['left-ltp-user-label'] !== undefined) {
                    leftLtpUserlabel = "<td>&nbsp;&nbsp;" + $filter('translate')('Left LTP') + "&nbsp;:&nbsp;</td><td><input type='text' readonly='readonly' value='" + linkData['left-ltp-user-label'] + "' /></td></tr>";
                }
                data += leftLtpUserlabel;


                // var rightLtp = "<tr><td>"+$filter('translate')('Right LTP')+"&nbsp;:&nbsp;</td><td><input type='text' readonly='readonly'/></td>";
                // if(linkData[svc.CONST.RIGHT_LTP_ID] !== undefined){
                //     var rightLtpId = linkData[svc.CONST.RIGHT_LTP_ID];
                //     var rightLtpNo = rightLtpId.substring(rightLtpId.lastIndexOf(":")+1);
                //     if(rightLtpNo !== undefined){
                //         rightLtp = "<tr><td>"+$filter('translate')('Right LTP')+"&nbsp;:&nbsp;</td><td><input type='text' readonly='readonly' value='"+rightLtpNo+"' /></td>";
                //     }
                // }
                // data += rightLtp;

                var rightLtpUserlabel = "<td>&nbsp;&nbsp;" + $filter('translate')('Left LTP') + "&nbsp;:&nbsp;</td><td><input type='text' readonly='readonly'/></td></tr>";
                if (linkData['right-ltp-user-label'] !== undefined) {
                    rightLtpUserlabel = "<td>&nbsp;&nbsp;" + $filter('translate')('Left LTP') + "&nbsp;:&nbsp;</td><td><input type='text' readonly='readonly' value='" + linkData['rigth-ltp-user-label'] + "' /></td></tr>";
                }
                data += rightLtpUserlabel;

                //var leftLtpMac = "<td>&nbsp;&nbsp;"+$filter('translate')('Left Ltp Mac')+"&nbsp;:&nbsp;</td><td><input type='text' /></td></tr>";
                if (linkData[svc.CONST.LEFT_LTP_MAC] !== undefined) {
                    var leftLtpMac = "<td>&nbsp;&nbsp;" + $filter('translate')('Left Ltp Mac') + "&nbsp;:&nbsp;</td><td><input type='text' readonly='readonly' value='" + linkData[svc.CONST.LEFT_LTP_MAC] + "' /></td></tr>";
                    data += leftLtpMac;
                }


                //var rightLtpMac = "<td>"+$filter('translate')('Right Ltp Mac')+"&nbsp;:&nbsp;</td><td><input type='text' /></td></tr></table><table><br>";
                if (linkData[svc.CONST.RIGHT_LTP_MAC] !== undefined) {
                    var rightLtpMac = "<td>" + $filter('translate')('Right Ltp Mac') + "&nbsp;:&nbsp;</td><td><input type='text' readonly='readonly' value='" + linkData[svc.CONST.RIGHT_LTP_MAC] + "' /></td></tr></table><br><table>";
                    data += rightLtpMac;
                }


                var linkTeAttrRun = "<tr><td><b><font color='#2ebpa4'> " + $filter('translate')('TE Atrribution') + "(RUN)</font></b></td></tr>";
                data += linkTeAttrRun;


                var availableBandwidth = "<tr><td>" + $filter('translate')('Available Bandwidth') + "&nbsp;:&nbsp;</td><td> <input type='text' /></td></tr>";
                var linkLatency = "<tr><td>" + $filter('translate')('Link Latency') + ":</td><td><input type='text'/></td></tr></table><br>";
                var physicalBandwidth = "<tr><td>" + $filter('translate')('Physical Bandwidth') + "&nbsp;:&nbsp;</td><td><input type='text' /></td></tr>";

                if (linkData[svc.CONST.LINK_RUN] !== undefined) {
                    if (linkData[svc.CONST.LINK_RUN][svc.CONST.AVAILABLE_BANDWIDTH] !== undefined) {
                        availableBandwidth = "<tr><td>" + $filter('translate')('Available Bandwidth') + "&nbsp;:&nbsp;</td><td> <input type='text' value='" + linkData[svc.CONST.LINK_RUN][svc.CONST.AVAILABLE_BANDWIDTH] + "' />(kbps)</td></tr>";
                    }

                    if (linkData[svc.CONST.LINK_RUN][svc.CONST.LINK_LATENCY] !== undefined) {
                        linkLatency = "<tr><td>" + $filter('translate')('Link Latency') + "&nbsp;:&nbsp;</td><td><input type='text' value='" + linkData[svc.CONST.LINK_RUN][svc.CONST.LINK_LATENCY] + "' />(us)</td></tr></table><br>";
                    }

                    if (linkData[svc.CONST.LINK_RUN][svc.CONST.PHYSICAL_BANDWIDTH] !== undefined) {
                        physicalBandwidth = "<tr><td>" + $filter('translate')('Physical Bandwidth') + "&nbsp;:&nbsp;</td><td><input type='text' value='" + linkData[svc.CONST.LINK_RUN][svc.CONST.PHYSICAL_BANDWIDTH] + "' />(kbps)</td></tr>";
                    }

                }
                data += physicalBandwidth;
                data += availableBandwidth;
                data += linkLatency;

                var linkTeAttrCfg = "<table><tr><td><b><font color='#25a2dc'> " + $filter('translate')('TE Atrribution') + "(CFG)</font></b></td></tr>";
                data += linkTeAttrCfg;

                var latency = "<tr><td>" + $filter('translate')('Latency') + ":</td><td><input type='text'/></td></tr>";
                var maxReservableBandwidth = "<tr><td>" + $filter('translate')('Max Reservable Bandwidth') + "&nbsp;:&nbsp;</td><td><input type='text' /></td></tr>";


                if (linkData[svc.CONST.LINK_CFG] !== undefined) {
                    if (linkData[svc.CONST.LINK_CFG][svc.CONST.LATENCY] !== undefined) {
                        latency = "<tr><td>" + $filter('translate')('Latency') + "&nbsp;:&nbsp;</td><td><input type='text' value='" + linkData[svc.CONST.LINK_CFG][svc.CONST.LATENCY] + "' />(us)</td></tr>";
                    }

                    if (linkData[svc.CONST.LINK_CFG][svc.CONST.MAX_RESERVABLE_BANDWIDTH] !== undefined) {
                        maxReservableBandwidth = "<tr><td>" + $filter('translate')('Max Reservable Bandwidth') + "&nbsp;:&nbsp;</td><td><input type='text' value='" + linkData[svc.CONST.LINK_CFG][svc.CONST.MAX_RESERVABLE_BANDWIDTH] + "' />(kbps)</td></tr>";
                    }
                }
                data += latency;
                data += maxReservableBandwidth;

                data += "</table>";

                info(data);


            }

        };

        svc.getExtNodeUserLabelById = function(nodeId, cb) {
            $.ajax({
                url: TopologyRestangular.configuration.baseUrl + "/restconf/operational/sptn-net-topology:net-topology/ext-nodes/ext-node/" + nodeId,
                type: 'get',
                async: false,
                success: function(response) {
                    if (!response) {
                        console.log("no data!");
                    } else {
                        cb(response['ext-node'][0]['user-label']);
                    }
                }
            });
        };

        svc.getNodeUserLabelById = function(nodeId, cb) {
            $.ajax({
                url: TopologyRestangular.configuration.baseUrl + "/restconf/operational/opendaylight-inventory:nodes/node/" + nodeId,
                type: 'get',
                async: false,
                success: function(response) {
                    if (!response) {
                        console.log("no data!");
                    } else {
                        cb(response['node'][0]['sdn-inventory:user-label']);
                    }
                }
            });
        };

        svc.getNodeIpById = function(nodeId, cb) {
            $.ajax({
                url: TopologyRestangular.configuration.baseUrl + "/restconf/operational/opendaylight-inventory:nodes/node/" + nodeId,
                type: 'get',
                async: false,
                success: function(response) {
                    if (!response) {
                        console.log("no data!");
                    } else {
                        cb(response['node'][0]['flow-node-inventory:ip-address']);
                    }
                }
            });
        };

        svc.getExtNodeIpById = function(nodeId, cb) {
            $.ajax({
                url: TopologyRestangular.configuration.baseUrl + "/restconf/operational/sptn-net-topology:net-topology/ext-nodes/ext-node/" + nodeId,
                type: 'get',
                async: false,
                success: function(response) {
                    if (!response) {
                        console.log("no data!");
                    } else {
                        cb(response['ext-node'][0]['ip']);
                    }
                }
            });
        };

        svc.updateNodeUserLabelById = function(input, cb) { //sptn-net-topology:update-node-userlabel
            // svc.base2().post('sptn-net-topology:update-node-userlabel',{input:input}).then(function() {
            //     cb('success');
            //     return;
            // },
            // function(response) {
            //     cb('error');
            // });

            svc.base2().post("sdn-inventory:config-node-info", {
                input: {
                    'id': input['node-id'],
                    'user-label': input['userlabel']
                }
            }).then(function() {
                    cb('success');
                },
                function(response) {
                    cb('error');
                });

            svc.base2().post('sptn-net-topology:update-ext-node-userlabel', { input: input }).then(function() {
                    cb('success');
                    return;
                },
                function(response) {
                    cb('error');
                });

        };

        //获取链路左右节点对应的ltp name
        svc.getLtpName = function(linkData) {

            $.ajax({
                url: TopologyRestangular.configuration.baseUrl + "/restconf/operational/opendaylight-inventory:nodes/node/" + linkData[svc.CONST.LEFT_NODE_ID] + "/node-connector/" + linkData[svc.CONST.LEFT_LTP_ID],
                type: "get",
                async: false,
                success: function(response) {
                    console.log("ID:" + response['node-connector'][0]['flow-node-inventory:name']);
                    LEFT_LTP_NAME = response['node-connector'][0]['flow-node-inventory:name'];
                }
            });

            $.ajax({
                url: TopologyRestangular.configuration.baseUrl + "/restconf/operational/opendaylight-inventory:nodes/node/" + linkData[svc.CONST.RIGHT_NODE_ID] + "/node-connector/" + linkData[svc.CONST.RIGHT_LTP_ID],
                type: "get",
                async: false,
                success: function(response) {
                    console.log("ID:" + response['node-connector'][0]['flow-node-inventory:name']);
                    RIGHT_LTP_NAME = response['node-connector'][0]['flow-node-inventory:name'];
                }
            });
        };


        svc.getTopoIds = function(cb) {
            return svc.base().one('topologies').get().then(function(response) {
                var data = response["topologies"]["topology"];
                cb(data);
            });
        };


        svc.getNodePosById = function(nodeId) {
            var nodePos = "";

            $.ajax({
                url: TopologyRestangular.configuration.baseUrl + "/restconf/operations/sptn-net-topology:get-node-coordinate-by-id",
                contentType: "application/json",
                type: 'post',
                async: false,
                data: JSON.stringify({ input: { 'node-id': nodeId } }),
                dataType: "json",
                success: function(response) {
                    nodePos = (response.output === undefined ? "" : response.output);
                }
            });
            return nodePos;
        };

        svc.getExtNodePosById = function(nodeId) {
            var nodePos = "";

            $.ajax({
                url: TopologyRestangular.configuration.baseUrl + "/restconf/operations/sptn-net-topology:get-ext-node-coordinate-by-id",
                contentType: "application/json",
                type: 'post',
                async: false,
                data: JSON.stringify({ input: { 'node-id': nodeId } }),
                dataType: "json",
                success: function(response) {
                    nodePos = (response.output === undefined ? "" : response.output);
                }
            });

            return nodePos;

        };

        svc.updateNodePosById = function(nodeId, x, y) {

            svc.base2().post('sptn-net-topology:update-node-coordinate', { input: { 'node-id': nodeId, 'x': x, 'y': y } }).then(function(response) {
                    console.log("update node position successfully");
                },
                function(response) {
                    console.log($filter('translate')('Error with status code:') + response.status);
                });

            svc.base2().post('sptn-net-topology:update-ext-node-coordinate', { input: { 'node-id': nodeId, 'x': x, 'y': y } }).then(function(response) {
                    console.log("update extnode position successfully");
                },
                function(response) {
                    console.log($filter('translate')('Error with status code:') + response.status);
                });

            //$state.reload();

        };


        svc.getAllNodes = function(type, cb) {

            $.ajax({
                type: "get",
                url: TopologyRestangular.configuration.baseUrl + "/restconf/operational/sptn-net-topology:net-topology/nodes",
                async: false,
                success: function(response) {
                    var nodeList = response["nodes"]["node"];

                    //对原生数据进行处理
                    angular.forEach(nodeList, function(node) {
                        var nodeId = node.id;
                        var name = node['name'];
                        var status = node['operate-status'];
                        var parentTopoId = node['parent-topo-id'];
                        var userLabel = node['user-label'];
                        if (userLabel === undefined) {
                            userLabel = "";
                        }
                        node.userlabel = userLabel;

                        if (type == 'name') {
                            node.label = name;
                        } else if (type == 'userlabel') {
                            node.label = userLabel;
                        }

                        node.size = 20;

                        var nodePos = svc.getNodePosById(node.id);

                        if (nodePos !== "") {
                            node.x = nodePos.x;
                            node.y = nodePos.y;
                        }

                        node.title = $filter('translate')('Node ID') + ':  ' + name + '<br>' +
                            $filter('translate')('User Label') + ':  ' + userLabel + '<br>' +
                            $filter('translate')('Parent Topo ID') + ':  ' + parentTopoId + '<br>' +
                            $filter('translate')('Operate Status') + ':  ' + $filter('translate')(status);

                        if (node["operate-status"] === "operate-up") {
                            node.group = "node-up";
                        } else if (node["operate-status"] === "operate-down") {
                            node.group = "node-down";
                        } else if (node["operate-status"] === "power-lost") {
                            node.group = "node-lost";
                        } else {
                            node.group = "node-unkown";
                        }

                    });
                    cb(nodeList);
                }

            });



            /*
            //通过接口获取到的原生数据 以下暂时为假数据
            var nodeList = [
                 {
                     id: 'openflow:1',
                     'operate-status': 'operate-up',
                     'admin-status': 'admin-up',
                     'power-status': 'power-up',
                     'parent-topo-id': 'flow:1',
                     'userlabel': 'openflow:1',
                     'node-type': 'physical',
                     'name': 'openflow:1',
                     'ip': '172.16.75.159'
                 },
                 {
                     id: 'openflow:6',
                     'operate-status': 'operate-down',
                     'admin-status': 'admin-up',
                     'power-status': 'power-up',
                     'parent-topo-id': 'flow:1',
                     'userlabel': 'openflow:6',
                     'node-type': 'physical',
                     'ip': '172.16.75.159'
                 },
                 {
                     id: 'openflow:2',
                     'operate-status': 'operate-up',
                     'admin-status': 'admin-up',
                     'power-status': 'power-up',
                     'parent-topo-id': 'flow:1',
                     'userlabel': 'openflow:2',
                     'node-type': 'physical',
                     'ip': '172.16.75.159'
                 },
                 {
                     id: 'openflow:3',
                     'operate-status': 'operate-up',
                     'admin-status': 'admin-up',
                     'power-status': 'power-up',
                     'parent-topo-id': 'flow:1',
                     'userlabel': 'openflow:3',
                     'node-type': 'physical',
                     'ip': '172.16.75.159'
                 },
                 {
                     id: 'openflow:4',
                     'operate-status': 'operate-up',
                     'admin-status': 'admin-up',
                     'power-status': 'power-up',
                     'parent-topo-id': 'flow:1',
                     'userlabel': 'openflow:4',
                     'node-type': 'physical',
                     'ip': '172.16.75.159'
                 },
                 {
                     id: 'openflow:5',
                     'operate-status': 'operate-up',
                     'admin-status': 'admin-up',
                     'power-status': 'power-up',
                     'parent-topo-id': 'flow:1',
                     'userlabel': 'openflow:5',
                     'node-type': 'physical',
                     'ip': '172.16.75.159'
                 }
             ];


             //对原生数据进行处理
             angular.forEach(nodeList,function(node){
                var nodeId = node.id;
                var userLabel = node['userlabel'];
                var status = node['operate-status'];
                node.label = node.id;
                node.value = 70;
                node.title = $filter('translate')('Node ID')+':  ' + nodeId + '<br>'+$filter('translate')('User Label')+':  '+userLabel+'<br> '+$filter('translate')('Operate Status')+':  '+status;
                if(node["operate-status"] === "operate-up"){
                    node.group = "node-up";
                }else if(node["operate-status"] === "operate-down"){
                    node.group = "node-down";
                }else if(node["operate-status"] === "power-lost"){
                    node.group = "node-lost";
                }else{
                    node.group = "node-unkown";
                }
             });
             cb(nodeList);
             */
        };

        svc.checkUndefined = function(value) {
            if (value === undefined) {
                return '';
            } else {
                return value;
            }
        };

        svc.getAllLinks = function(cb) {
            $.ajax({
                url: TopologyRestangular.configuration.baseUrl + "/restconf/operations/sptn-net-topology:get-all-links-info",
                contentType: "application/json",
                type: 'post',
                async: false,
                dataType: "json",
                data: JSON.stringify({ input: {} }),
                success: function(response) {
                    var linkList = response["output"]["link"]; //需要sdn控制器连接后才有数据

                    //对原生数据进行处理
                    var visLinkList = [];
                    var visLink;
                    angular.forEach(linkList, function(link) {
                        var leftLtpId = link['left-ltp-id'];
                        var rightLtpId = link['right-ltp-id'];
                        var status = link['operate-status'];
                        visLink = {};
                        visLink.color = {};
                        visLink.id = link.id;
                        visLink.from = link['left-node-id'];
                        visLink.to = link['right-node-id'];
                        visLink['left-ltp-id'] = link['left-ltp-id'];
                        visLink['right-ltp-id'] = link['right-ltp-id'];
                        visLink.dashes = false;

                        var leftNodeUserLabel = link['left-node-user-label'];
                        var rightNodeUserLabel = link['right-node-user-label'];
                        var leftNodeName = link['left-node-name'];
                        var rightNodeName = link['right-node-name'];

                        var leftLtpUserlabel = link['left-ltp-user-label'];
                        var rightLtpUserlabel = link['right-ltp-user-label'];
                        var leftLtpName = link['left-ltp-name'];
                        var rightLtpName = link['right-ltp-name'];


                        visLink.title = $filter('translate')('Left Node') + ":  " + svc.checkUndefined(leftNodeUserLabel) + "<br>" +
                            $filter('translate')('Right Node') + ":  " + svc.checkUndefined(rightNodeUserLabel) + "<br>" +
                            $filter('translate')('Left Ltp ID') + ":  " + svc.checkUndefined(leftLtpUserlabel) + "<br>" +
                            $filter('translate')('Right Ltp ID') + ":  " + svc.checkUndefined(rightLtpUserlabel) + "<br>" +
                            $filter('translate')('Operate Status') + ":  " + $filter('translate')(status);

                        if (link['operate-status'] === 'operate-up') {
                            visLink.color.color = "green";
                            visLink.color.highlight = "green";
                        } else if (link['operate-status'] === 'operate-down') {
                            visLink.color.color = "red";
                            visLink.color.highlight = "red";
                        }

                        visLinkList.push(visLink);
                    });

                    cb(visLinkList);
                }

            });

            // $.ajax({
            //     type : "get",
            //     url : TopologyRestangular.configuration.baseUrl+"/restconf/operational/sptn-net-topology:net-topology/links",
            //     async : false,
            //     success : function(response){
            //           var linkList = response["links"]["link"];//需要sdn控制器连接后才有数据

            //           //对原生数据进行处理
            //           var visLinkList = [];
            //           var visLink;
            //           angular.forEach(linkList,function(link){
            //             var leftLtpId = link['left-ltp-id'];
            //             var rightLtpId = link['right-ltp-id'];
            //             var status = link['operate-status'];
            //             visLink = {};
            //             visLink.color = {};
            //             visLink.id = link.id;
            //             visLink.from = link['left-node-id'];
            //             visLink.to = link['right-node-id'];
            //             visLink['left-ltp-id'] = link['left-ltp-id'];
            //             visLink['right-ltp-id'] = link['right-ltp-id'];
            //             visLink.dashes = false;

            //             var leftNodeUserLabel = link['left-node-user-label'];
            //             var rightNodeUserLabel = link['right-node-user-label'];
            //             var leftNodeName = link['left-node-name'];
            //             var rightNodeName = link['right-node-name'];

            //             var leftLtpUserlabel = link['left-ltp-user-label'];
            //             var rightLtpUserlabel = link['right-ltp-user-label'];
            //             var leftLtpName = link['left-ltp-name'];
            //             var rightLtpName= link['right-ltp-name'];


            //             visLink.title = $filter('translate')('Left Node') + ":  " + svc.checkUndefined(leftNodeUserLabel) + "<br>" +
            //             $filter('translate')('Right Node') + ":  " + svc.checkUndefined(rightNodeUserLabel) + "<br>" +
            //             $filter('translate')('Left Ltp ID') + ":  " + svc.checkUndefined(leftLtpUserlabel) + "<br>" +
            //             $filter('translate')('Right Ltp ID') + ":  " + svc.checkUndefined(rightLtpUserlabel) + "<br>" +
            //             $filter('translate')('Operate Status') + ":  " + $filter('translate')(status);

            //             if(link['operate-status'] === 'operate-up'){
            //                 visLink.color.color = "green";
            //                 visLink.color.highlight = "green";
            //             }else if(link['operate-status'] === 'operate-down'){
            //                 visLink.color.color = "red";
            //                 visLink.color.highlight = "red";
            //             }

            //             visLinkList.push(visLink);
            //           });

            //           cb(visLinkList);
            //     }

            // });



            /*
        var linkList = [
          {
            id:'link11',
            'left-node-id':'openflow:1',
            'left-ltp-id':'openflow:1:LOCAL',
            'right-node-id':'openflow:2',
            'right-ltp-id':'openflow:2:LOCAL',
            'parent-topo-id':'flow:1',
            'operate-status':'operate-up'
          },
          {
            id:'link111',
            'left-node-id':'openflow:1',
            'left-ltp-id':'openflow:1:1',
            'right-node-id':'openflow:2',
            'right-ltp-id':'openflow:2:LOCAL',
            'parent-topo-id':'flow:1',
            'operate-status':'operate-up'
          },
          {
            id:'link222',
            'left-node-id':'openflow:2',
            'left-ltp-id':'openflow:2:LOCAL',
            'right-node-id':'openflow:1',
            'right-ltp-id':'openflow:1:1',
            'parent-topo-id':'flow:1',
            'operate-status':'operate-up'
          },
          {
            id:'link12',
            'left-node-id':'openflow:1',
            'left-ltp-id':'openflow:1:LOCAL',
            'right-node-id':'openflow:3',
            'right-ltp-id':'openflow:3:LOCAL',
            'parent-topo-id':'flow:1',
            'operate-status':'operate-down'
          },
          {
            id:'link13',
            'left-node-id':'openflow:5',
            'left-ltp-id':'openflow:5:LOCAL',
            'right-node-id':'openflow:6',
            'right-ltp-id':'openflow:6:LOCAL',
            'parent-topo-id':'flow:1',
            'operate-status':'operate-up'
          },
          {
            id:'link14',
            'left-node-id':'openflow:4',
            'left-ltp-id':'openflow:4:LOCAL',
            'right-node-id':'openflow:6',
            'right-ltp-id':'openflow:6:LOCAL',
            'parent-topo-id':'flow:1',
            'operate-status':'operate-up'
          },
          {
            id:'link15',
            'left-node-id':'openflow:4',
            'left-ltp-id':'openflow:4:LOCAL',
            'right-node-id':'openflow:10',
            'right-ltp-id':'openflow:10:LOCAL',
            'parent-topo-id':'flow:1',
            'operate-status':'operate-up'
          }
      ];
      //对原生数据进行处理
      var visLinkList = [];
      var visLink;
      angular.forEach(linkList,function(link){
        var leftLtpId = link['left-ltp-id'];
        var rightLtpId = link['right-ltp-id'];
        var status = link['operate-status'];
        visLink = {};
        visLink.color = {};
        visLink.id = link.id;
        visLink.from = link['left-node-id'];
        visLink.to = link['right-node-id'];
        visLink['left-ltp-id'] = link['left-ltp-id'];
        visLink['right-ltp-id'] = link['right-ltp-id'];
        visLink.dashes = false;

        visLink.title = $filter('translate')('Left Ltp ID') + ":  " +leftLtpId + "<br>" +
        $filter('translate')('Right Ltp ID') + ":  " +rightLtpId+ "<br>" +
        $filter('translate')('Operate Status') + ":  " + $filter('translate')(status);

        if(link['operate-status'] === 'operate-up'){
            visLink.color.color = "green";
            visLink.color.highlight = "green";
        }else if(link['operate-status'] === 'operate-down'){
            visLink.color.color = "red";
            visLink.color.highlight = "red";
        }

        visLinkList.push(visLink);
      });
      cb(visLinkList);
      */
        };

        svc.getAllExtNodes = function(type, cb) {

            $.ajax({
                type: "get",
                url: TopologyRestangular.configuration.baseUrl + "/restconf/operational/sptn-net-topology:net-topology/ext-nodes",
                async: false,
                success: function(response) {
                    //通过接口获取到的原生数据
                    var extNodeList = response["ext-nodes"]["ext-node"];
                    //对原生数据进行处理
                    var visExtNodeList = [];

                    angular.forEach(extNodeList, function(extNode) {
                        var nodeId = extNode.id;
                        var resourceId = extNode['resource-id'];
                        var parentTopoId = extNode['parent-topo-id'];
                        var userLabel = extNode['user-label'];
                        var ip = extNode['ip'];
                        var status = extNode['operate-status'];
                        var visExtNode = {};

                        visExtNode.id = extNode.id; //key
                        visExtNode.label = userLabel;
                        visExtNode.size = 20;

                        var nodePos = svc.getExtNodePosById(extNode.id);

                        if (nodePos !== "") {
                            visExtNode.x = nodePos.x;
                            visExtNode.y = nodePos.y;
                        }

                        visExtNode['name'] = extNode['name'];
                        visExtNode['user-label'] = extNode['user-label'];
                        visExtNode['resource-id'] = extNode['resource-id'];
                        visExtNode['operate-status'] = extNode['operate-status'];
                        visExtNode['admin-status'] = extNode['admin-status'];
                        visExtNode['parent-topo-id'] = extNode['parent-topo-id'];

                        if (type == 'name') {
                            visExtNode.label = extNode['name'];
                        } else if (type == 'userlabel') {
                            visExtNode.label = extNode['user-label'];
                        }

                        visExtNode.title = $filter('translate')('Node ID') + ':  ' + extNode['name'] + '<br>' +
                            $filter('translate')('Parent Topo ID') + ':  ' + parentTopoId + '<br>' +
                            $filter('translate')('Resource ID') + ':  ' + resourceId + '<br>' +
                            $filter('translate')('User Label') + ':  ' + userLabel + '<br>' +
                            'IP:  ' + ip + '<br>' + $filter('translate')('Operate Status') + ':  ' + $filter('translate')(status);

                        if (status === 'operate-up') {
                            visExtNode.group = "extnode-up";
                        } else if (status === 'operate-down') {
                            visExtNode.group = "extnode-down";
                        } else if (status === 'power-lost') {
                            visExtNode.group = "extnode-lost";
                        } else {
                            visExtNode.group = "extnode-unkown";
                        }

                        // visExtNode.image = 'assets/images/' + node.icon;
                        // visExtNode.shape = 'image';
                        visExtNode.userlabel = extNode['user-label'];
                        visExtNodeList.push(visExtNode);

                    });

                    cb(visExtNodeList);
                }

            });

        };

        svc.getAllExtLinks = function(cb) {

            $.ajax({
                type: "get",
                url: TopologyRestangular.configuration.baseUrl + "/restconf/operational/sptn-net-topology:net-topology/ext-links",
                async: false,
                success: function(response) {
                    //通过接口获取到的原生数据
                    var extLinkList = response["ext-links"]["ext-link"];
                    //对原生数据进行处理
                    var visExtLinkList = [];

                    angular.forEach(extLinkList, function(extLink) {
                        var leftNodeId = extLink['left-node-id'];
                        var rightNodeId = extLink['right-node-id'];
                        var leftLtpId = extLink['left-ltp-id'];
                        var rightLtpId = extLink['right-ltp-id'];
                        var leftLtpMac = extLink['left-ltp-mac'];
                        var rightLtpMac = extLink['right-ltp-mac'];
                        var userLabel = extLink['user-label'];
                        var prtTopoId = extLink['parent-topo-id'];
                        var status = extLink['operate-status'];

                        var visExtLink = {};
                        visExtLink.color = {};
                        visExtLink.id = extLink.id;
                        visExtLink.from = extLink['left-node-id'];
                        visExtLink.to = extLink['right-node-id'];
                        visExtLink['left-ltp-id'] = extLink['left-ltp-id'];
                        visExtLink['right-ltp-id'] = extLink['right-ltp-id'];
                        visExtLink['left-ltp-mac'] = extLink['left-ltp-mac'];
                        visExtLink['right-ltp-mac'] = extLink['right-ltp-mac'];
                        visExtLink['parent-topo-id'] = extLink['parent-topo-id'];
                        visExtLink['operate-status'] = extLink['operate-status'];
                        visExtLink.dashes = false; //visExtLink.style = 'line';

                        if (visExtLink['operate-status'] === "operate-up") {
                            visExtLink.color.color = "blue";
                            visExtLink.color.highlight = "blue";
                        } else if (visExtLink['operate-status'] === "operate-down") {
                            visExtLink.color.color = "red";
                            visExtLink.color.highlight = "red";
                        }

                        var leftNodeUserLabel = extLink['left-node-user-label'];
                        var rightNodeUserLabel = extLink['right-node-user-label'];
                        var leftNodeName = extLink['left-node-name'];
                        var rightNodeName = extLink['right-node-name'];

                        var leftLtpUserlabel = extLink['left-ltp-user-label'];
                        var rightLtpUserlabel = extLink['right-ltp-user-label'];
                        var leftLtpName = extLink['left-ltp-name'];
                        var rightLtpName = extLink['right-ltp-name'];

                        visExtLink.title = $filter('translate')('Left Node') + ":  " + svc.checkUndefined(leftNodeUserLabel) + "<br>" +
                            $filter('translate')('Right Node') + ":  " + svc.checkUndefined(rightNodeUserLabel) + "<br>" +
                            $filter('translate')('Left Ltp ID') + ":  " + svc.checkUndefined(leftLtpUserlabel) + "<br>" +
                            $filter('translate')('Right Ltp ID') + ":  " + svc.checkUndefined(rightLtpUserlabel) + "<br>" +
                            $filter('translate')('Left Ltp Mac') + ":  " + svc.checkUndefined(leftLtpMac) + "<br>" +
                            $filter('translate')('Right Ltp Mac') + ":  " + svc.checkUndefined(rightLtpMac) + "<br>" +
                            $filter('translate')('User Label') + ":  " + svc.checkUndefined(userLabel) + "<br>" +
                            $filter('translate')('Parent Topo ID') + ":  " + svc.checkUndefined(prtTopoId) + "<br>" +
                            $filter('translate')('Operate Status') + ":  " + $filter('translate')(status);

                        visExtLinkList.push(visExtLink);

                    });

                    cb(visExtLinkList);
                }

            });

        };

        svc.createExtNode = function(extNode, cb) {
            svc.base2().post('sptn-net-topology:create-ext-node', { input: extNode }).then(function(response) {
                    cb(response);
                },
                function(response) {
                    cb("Error");
                });
        };

        svc.createExtLink = function(extLink, cb) {
            svc.base2().post('sptn-net-topology:create-ext-link', { input: extLink }).then(function(response) {
                    cb(response);
                },
                function(response) {
                    cb("Error");
                });
        };

        svc.mergeNodeConnInfo = function(protocal, nodeId, nodeConnData) {

            var connData = {};
            connData["neid"] = nodeId;
            connData["ip"] = nodeConnData.ip;
            connData["port"] = nodeConnData.port;
            connData["username"] = nodeConnData.name;
            connData["passwd"] = nodeConnData.pwd;

            var connDataList = [];
            connDataList.push(connData);

            var inputData = {};
            inputData["operation"] = "merge";
            inputData["ssh-list"] = connDataList;



            svc.base2().post('cli:' + protocal, { input: inputData }).then(function(response) {
                    console.log("merge " + nodeId + " successfully");
                },
                function(response) {
                    console.log("merge " + nodeId + " unsuccessfully");
                });

        };

        svc.getNodeConnInfo = function(protocal, nodeId, cb) {
            var connData = {};
            connData["neid"] = nodeId;

            var connDataList = [];
            connDataList.push(connData);

            var inputData = {};
            inputData["operation"] = "get";
            inputData["ssh-list"] = connDataList;

            $.ajax({
                url: TopologyRestangular.configuration.baseUrl + "/restconf/operations/cli:" + protocal,
                contentType: "application/json",
                type: 'post',
                async: false,
                data: JSON.stringify({ input: inputData }),
                dataType: "json",
                success: function(response) {

                    if (response.output["ssh-list"]) {
                        var orgData = response.output["ssh-list"][0];
                        console.log("get " + nodeId + " successfully");
                        var nodeConnData = {};
                        nodeConnData.ip = orgData["ip"];
                        nodeConnData.port = orgData["port"];
                        nodeConnData.name = orgData["username"];
                        nodeConnData.pwd = orgData["passwd"];
                        cb(nodeConnData);
                    }

                }
            });

            /*
            svc.base2().post('cli:'+protocal,{input:inputData}).then(function(response) {
                console.log("get "+nodeId+" successfully");
                var orgData = response.output["ssh-list"][0];
                var nodeConnData = {};
                nodeConnData.ip = orgData["ip"];
                nodeConnData.port = orgData["port"];
                nodeConnData.name = orgData["username"];
                nodeConnData.pwd = orgData["passwd"];
                cb(nodeConnData);
            },
            function(response) {
                console.log("get "+nodeId+" unsuccessfully");
            });
            */
        };

        svc.delNodeConnInfo = function(protocal, nodeId) {
            var connData = {};
            connData["neid"] = nodeId;

            var connDataList = [];
            connDataList.push(connData);

            var inputData = {};
            inputData["operation"] = "delete";
            inputData["ssh-list"] = connDataList;

            svc.base2().post('cli:' + protocal, { input: inputData }).then(function(response) {
                    console.log("delete " + nodeId + " successfully");
                },
                function(response) {
                    console.log("delete " + nodeId + " unsuccessfully");
                });
        };

        svc.getTopologyInfo = function(cb) {
            var isEdgePresent = function(inLinks, srcId, dstId) {
                if (inLinks[srcId + ":" + dstId] === undefined && inLinks[dstId + ":" + srcId] === undefined) {
                    return false;
                } else {
                    return true;
                }
            };

            return svc.base().get().then(function(ntData) {
                    var nodes = [];
                    var links = [];
                    var linksMap = {};

                    var netTopology = "net-topology";
                    ntData = ntData[netTopology];
                    if (ntData.nodes) {
                        angular.forEach(ntData.nodes.node, function(nodeData) {
                            var nodeId = nodeData[svc.CONST.ID];
                            var name = nodeData[svc.CONST.NAME];
                            var userLabel = nodeData[svc.CONST.USER_LABEL];
                            if (userLabel === undefined) {
                                userLabel = "";
                            }

                            var label = userLabel;

                            var nodePos = svc.getNodePosById(nodeId);
                            var x, y;

                            if (nodePos !== "") {
                                x = nodePos.x;
                                y = nodePos.y;
                            }

                            /*
                            if(userLabel !== undefined && userLabel.indexOf(":") >= 0){
                                label = "Raisecom" + userLabel.substring(userLabel.indexOf(":"));
                            }
                            */

                            var leftNodeId = nodeData[svc.CONST.LEFT_NODE_ID];
                            var leftLtpId = nodeData[svc.CONST.LEFT_LTP_ID];
                            var rightNodeId = nodeData[svc.CONST.RIGHT_NODE_ID];
                            var rightLtpId = nodeData[svc.CONST.RIGHT_LTP_ID];
                            var parentTopoId = nodeData[svc.CONST.PARENT_TOPO_ID];
                            var status = nodeData[svc.CONST.OPERATE_STATUS];

                            var groupType;

                            if (status === "operate-up") {
                                groupType = "node-up";
                            } else if (status === "operate-down") {
                                groupType = "node-down";
                            } else if (status === "power-lost") {
                                groupType = "node-lost";
                            } else {
                                groupType = "node-unkown";
                            }

                            nodeTitle = $filter('translate')('Node ID') + ':  ' + name + '<br>' +
                                $filter('translate')('User Label') + ':  ' + userLabel + '<br>' +
                                $filter('translate')('Parent Topo ID') + ':  ' + parentTopoId + '<br>' +
                                $filter('translate')('Operate Status') + ':  ' + $filter('translate')(status);

                            if (nodeId.indexOf("openflow") >= 0) {
                                nodes.push({ 'id': nodeId, 'label': label, 'name': name, 'userlabel': userLabel, 'status': status, group: groupType, size: 20, x: x, y: y, title: nodeTitle });
                            }
                        });
                    }

                    if (ntData.links) {
                        angular.forEach(ntData.links.link, function(linkData) {
                            var linkId = linkData[svc.CONST.ID];
                            //var label = linkData[svc.CONST.USER_LABEL];
                            var leftNodeId = linkData[svc.CONST.LEFT_NODE_ID];
                            var leftLtpId = linkData[svc.CONST.LEFT_LTP_ID];
                            var rightNodeId = linkData[svc.CONST.RIGHT_NODE_ID];
                            var rightLtpId = linkData[svc.CONST.RIGHT_LTP_ID];
                            var operateStatus = linkData[svc.CONST.OPERATE_STATUS];

                            svc.getLtpName(linkData);

                            if (leftNodeId != null && rightNodeId != null && !isEdgePresent(linksMap, leftLtpId, rightLtpId)) {
                                var linkColor;

                                if (operateStatus == "operate-up") {
                                    linkColor = {
                                        color: "green",
                                        highlight: "green"
                                    };
                                } else {
                                    linkColor = {
                                        color: "red",
                                        highlight: "red"
                                    };
                                }

                                if (leftNodeId.indexOf("openflow") >= 0 && rightNodeId.indexOf("openflow") >= 0) {
                                    links.push({
                                        id: linkId,
                                        'from': leftNodeId,
                                        'to': rightNodeId,
                                        dashes: false,
                                        color: linkColor,
                                        title: $filter('translate')('Left Ltp ID') + ":  " + linkData['left-ltp-user-label'] + "<br>" +
                                            $filter('translate')('Right Ltp ID') + ":  " + linkData['right-ltp-user-label'] + "<br>" +
                                            $filter('translate')('Operate Status') + ":  " + $filter('translate')(operateStatus)
                                    });
                                    linksMap[leftLtpId + ":" + rightLtpId] = linkId;
                                }
                            }
                        });
                    }

                    var data = {
                        nodes: nodes,
                        links: links,
                    };
                    cb(data);
                },
                function(response) {
                    console.log("Error with status code", response.status);
                });
        };

        return svc;
    }]);



    topology.register.factory('NetworkTopologySvc', function(TopologyRestangular) {
        var svc = {
            base: function() {
                return TopologyRestangular.one('restconf').one('operational').one('network-topology:network-topology');
            },
            data: null,
            TOPOLOGY_CONST: {
                HT_SERVICE_ID: "host-tracker-service:id",
                IP: "ip",
                HT_SERVICE_ATTPOINTS: "host-tracker-service:attachment-points",
                HT_SERVICE_TPID: "host-tracker-service:tp-id",
                NODE_ID: "node-id",
                LINK_ID: "link-id",
                SOURCE_NODE: "source-node",
                DEST_NODE: "dest-node",
                SOURCE_TP: "source-tp",
                DEST_TP: "dest-tp",
                ADDRESSES: "addresses",
                HT_SERVICE_ADDS: "host-tracker-service:addresses",
                HT_SERVICE_IP: "host-tracker-service:ip"
            }
        };
        svc.getCurrentData = function() {
            return svc.data;
        };
        svc.getAllNodes = function() {
            svc.data = svc.base().getList();
            return svc.data;
        };
        svc.getNode = function(node, cb) {
            //Determines the node id from the nodes array corresponding to the text passed
            var getNodeIdByText = function getNodeIdByText(inNodes, text) {
                var nodes = inNodes.filter(function(item, index) {
                        return item.label === text;
                    }),
                    nodeId;

                if (nodes && nodes[0]) {
                    nodeId = nodes[0].id;
                } else {
                    return null;
                }

                return nodeId;
            };
            //Checks if the edge is present in the links map or not so we show single edge link between switches
            var isEdgePresent = function(inLinks, srcId, dstId) {
                if (inLinks[srcId + ":" + dstId] === undefined && inLinks[dstId + ":" + srcId] === undefined) {
                    return false;
                } else {
                    return true;
                }
            };
            return svc.base().one("topology", node).get().then(function(ntData) {

                var nodes = [];
                var links = [];
                var linksMap = {};

                if (ntData.topology && ntData.topology[0]) {
                    //Loop over the nodes
                    angular.forEach(ntData.topology[0].node, function(nodeData) {
                        var groupType = "",
                            nodeTitle = "",
                            nodeLabel = "";
                        var nodeId = nodeData[svc.TOPOLOGY_CONST.NODE_ID];
                        if (nodeId !== undefined && nodeId.indexOf("host") >= 0) {
                            groupType = "host";
                            var ht_serviceadd = nodeData[svc.TOPOLOGY_CONST.ADDRESSES];
                            if (ht_serviceadd === undefined) {
                                ht_serviceadd = nodeData[svc.TOPOLOGY_CONST.HT_SERVICE_ADDS];
                            }
                            if (ht_serviceadd !== undefined) {
                                var ip;
                                //get title info
                                for (var i = 0; i < ht_serviceadd.length; i++) {
                                    ip = ht_serviceadd[i][svc.TOPOLOGY_CONST.IP];
                                    if (ip === undefined) {
                                        ip = ht_serviceadd[i][svc.TOPOLOGY_CONST.HT_SERVICE_IP];
                                    }
                                    nodeTitle += 'IP: <b>' + ip + '</b><br>';
                                }
                            }
                            nodeTitle += 'Type: Host';
                        } else {
                            groupType = "switch";
                            nodeTitle = 'Name: ' + nodeId + '<br>Type: Switch';
                        }

                        nodeLabel = nodeData[svc.TOPOLOGY_CONST.NODE_ID];
                        nodes.push({ 'id': nodeId, 'label': nodeId, group: groupType, value: 20, title: nodeTitle });
                    });
                    //Loops over the links
                    angular.forEach(ntData.topology[0].link, function(linkData) {
                        var srcId = getNodeIdByText(nodes, linkData.source[svc.TOPOLOGY_CONST.SOURCE_NODE]),
                            dstId = getNodeIdByText(nodes, linkData.destination[svc.TOPOLOGY_CONST.DEST_NODE]),
                            srcPort = linkData.source[svc.TOPOLOGY_CONST.SOURCE_TP],
                            dstPort = linkData.destination[svc.TOPOLOGY_CONST.DEST_TP],
                            linkId = linkData[svc.TOPOLOGY_CONST.LINK_ID];
                        if (srcId != null && dstId != null && !isEdgePresent(linksMap, srcId, dstId)) {
                            links.push({ id: linkId, 'from': srcId, 'to': dstId, title: 'Source Port: ' + srcPort + '<br>Dest Port: ' + dstPort });
                            linksMap[srcId + ":" + dstId] = linkId;
                        }
                    });

                }

                var data = {
                    "nodes": nodes,
                    "links": links
                };
                cb(data);
            }, function(response) {
                console.log("Error with status code", response.status);
            });
        };
        return svc;
    });

    topology.register.factory('ServiceTopologySvc', ['$filter', 'TopologyRestangular', function($filter, TopologyRestangular) {
        var svc = {
            base: function() {
                return TopologyRestangular.all('restconf').one('operations');
            }
        };

        //判断node是否重复
        svc.IsNodeExist = function(nodes, id) {
            angular.forEach(nodes, function(node, index) {
                if (node.id == id) {
                    return true;
                }
            });
            return false;
        };

        //判断link是否重复
        svc.IsEdgeExist = function(inLinks, srcId, dstId) {
            if (inLinks[srcId + ":" + dstId] === undefined && inLinks[dstId + ":" + srcId] === undefined) {
                return false;
            } else {
                return true;
            }
        };


        svc.checkAttrUndefined = function(data) {
            return ((data === undefined || data === null) ? '' : data);
        };
        //整合node对象为vis要求的格式
        svc.formatVisNodes = function(node, type) {
            var group = '';
            var status = '';
            var title = '';
            var icon = '';

            if (node['operate-status'] == 'operate-up') {
                icon = (type == 'sdn') ? node['icon'] : 'ext-up';
                status = $filter('translate')('Operate Up');
            } else if (node['operate-status'] == 'operate-down') {
                if (node['power-status'] == 'lost-contact') {
                    icon = (type == 'sdn') ? node['icon'] : 'ext-lost';
                    status = $filter('translate')('Lost Contact');
                } else if (node['power-status'] == 'power-down') {
                    icon = (type == 'sdn') ? node['icon'] : 'ext-down';
                    status = $filter('translate')('power-down');
                } else {
                    icon = (type == 'sdn') ? node['icon'] : 'ext-down';
                    status = $filter('translate')('Unknown');
                }
            }

            var userlabel = svc.checkAttrUndefined(node.userlabel);
            var nodeid = svc.checkAttrUndefined(node.id);
            var nodesName = svc.checkAttrUndefined(node.name);
            var nodeIp = svc.checkAttrUndefined(node.ip);
            var adminStatus = svc.checkAttrUndefined(node['admin-status']);
            var nodeType = svc.checkAttrUndefined(node['node-type']);

            title += $filter('translate')('Node ID') + ": " + nodesName + "<br>";
            title += $filter('translate')('User Label') + ": " + userlabel + "<br>";

            if (type == 'sdn') {
                title += $filter('translate')('Operate Status') + ": " + $filter('translate')(status);
            }
            var visNode = {
                id: node.id,
                label: node.userlabel,
                size: 20,
                userlabel: node.userlabel,
                name: nodesName,
                ip: nodeIp,
                status: status,
                adminstatus: adminStatus,
                nodetype: nodeType,
                //parentid: parentTopoId,
                //group: group,
                image: 'assets/images/' + icon + '.png',
                shape: 'image',
                title: title
            };

            //增加拓扑id属性
            if (node.hasOwnProperty('parent-topo-id')) {
                visNode.topoId = svc.checkAttrUndefined(node['parent-topo-id']);
            }

            return visNode;
        };

        //格式化link的状态显示的中文
        svc.formatLinkStatus = function(status) {
            var str = "";
            if (status == 'operate-up') {
                str = $filter('translate')('Operate Up');
            } else if (status == 'operate-down') {
                str = $filter('translate')('Operate Down');
            }

            return str;
        };

        //删除link中源宿节点相同的link
        svc.deleteRepeatEdges = function(aEdges) {
            var arr = [];
            var flag = true;

            for (var a = 0; a < aEdges.length; a++) {
                for (var b = a + 1; b < aEdges.length; b++) {
                    var aa = aEdges[a].from + aEdges[a].to;
                    var bb = aEdges[b].from + aEdges[b].to;
                    var cc = aEdges[b].to + aEdges[b].from;

                    if (aa == bb || aa == cc) {
                        flag = false;
                        break;
                    }
                }

                if (flag) {
                    arr.push(aEdges[a]);
                }

                flag = true;
            }

            return arr;
        };

        //删除要画云的node
        svc.deleteExtCloudNodes = function(sArr, dArr) {
            var flag = true;
            var arr = [];
            for (var aa = 0; aa < dArr.length; aa++) {
                for (var bb = 0; bb < sArr.length; bb++) {
                    if (dArr[aa].id == sArr[bb].id) {
                        flag = false;
                        break;
                    }
                }

                if (flag) {
                    arr.push(dArr[aa]);
                }

                flag = true;
            }

            return arr;
        };

        //删除同源同宿同端口的lsp的link
        svc.deleteLspRepeatEdges = function(aEdges) {
            var arr = [];
            var flag = true;

            for (var a = 0; a < aEdges.length; a++) {
                for (var b = a + 1; b < aEdges.length; b++) {
                    var aa = aEdges[a].from + aEdges[a].fromport + aEdges[a].to + aEdges[a].toport;
                    var bb = aEdges[b].from + aEdges[b].fromport + aEdges[b].to + aEdges[b].toport;
                    var cc = aEdges[b].to + aEdges[b].toport + aEdges[b].from + aEdges[b].fromport;

                    if (aa == bb || aa == cc) {
                        flag = false;
                        break;
                    }
                }

                if (flag) {
                    arr.push(aEdges[a]);
                }

                flag = true;
            }

            return arr;
        };

        //获取eline的拓扑图数据
        svc.getElineTopology = function(cb) {
            function formatElineData(data, cb) {
                var aNodes = [];
                var aEdges = [];
                var linksMap = {};

                var oSameNodeEline = {};

                if (data && data.output) {
                    if (data.output['eline-node-list']) {
                        angular.forEach(data.output['eline-node-list'], function(node, index) {
                            if ((node.id.indexOf('openflow') !== -1) && (!svc.IsNodeExist(aNodes, node.id))) {
                                var visNode = svc.formatVisNodes(node, 'sdn');
                                aNodes.push(visNode);
                            }
                        });
                    }

                    if (data.output['eline-ext-node-list']) {
                        angular.forEach(data.output['eline-ext-node-list'], function(extNode, index) {
                            if (!svc.IsNodeExist(aNodes, extNode.id)) {
                                var visNode = svc.formatVisNodes(extNode, 'ext');
                                aNodes.push(visNode);
                            }
                        });
                    }

                    var strChineseIndex = ['1:2', '1:1'];
                    if (data.output['eline-link-list']) {
                        angular.forEach(data.output['eline-link-list'], function(link, index) {
                            if (link['left-node-id'] && link['right-node-id']) {
                                var linkColor = '';

                                if (link['operate-status'] == 'operate-up') {
                                    linkColor = 'green';
                                } else if (link['operate-status'] == 'operate-down') {
                                    linkColor = 'red';
                                }

                                var elineuserlabel = (link['eline-userlabel'] === undefined || link['eline-userlabel'] === null) ? '' : link['eline-userlabel'];
                                var sRole = (link.role === undefined || link.role === null) ? '' : link.role.toLowerCase();
                                var leftNodeId = (link['left-node-id'] === undefined || link['left-node-id'] === null) ? '' : link['left-node-id'];
                                var rightNodeId = (link['right-node-id'] === undefined || link['right-node-id'] === null) ? '' : link['right-node-id'];
                                var operateStatus = (link['operate-status'] === undefined || link['operate-status'] === null) ? '' : link['operate-status'];
                                var leftVlanList = (link['left-vlan-list'] === undefined || link['left-vlan-list'] === null) ? '' : link['left-vlan-list'];
                                var rightVlanList = (link['right-vlan-list'] === undefined || link['right-vlan-list'] === null) ? '' : link['right-vlan-list'];
                                var leftLtpId = (link['left-ltp-id'] === undefined || link['left-ltp-id'] === null) ? '' : link['left-ltp-id'];
                                var rightLtpId = (link['right-ltp-id'] === undefined || link['right-ltp-id'] === null) ? '' : link['right-ltp-id'];
                                var relation = (link['relation'] === undefined || link['relation'] === null) ? '' : link['relation'];

                                //var sourceNodeUserlabel = (link['left-node-user-label'] === undefined || link['left-node-user-label'] === null) ? '' : link['left-node-user-label'];
                                //var destNodeUserlabel = (link['right-node-user-label'] === undefined || link['right-node-user-label'] === null) ? '' : link['right-node-user-label'];

                                var sourceLtpUserlabel = (link['left-ltp-user-label'] === undefined || link['left-ltp-user-label'] === null) ? '' : link['left-ltp-user-label'];
                                var destLtpUserlabel = (link['right-ltp-user-label'] === undefined || link['right-ltp-user-label'] === null) ? '' : link['right-ltp-user-label'];
                                var sourceLtpName = (link['left-ltp-name'] === undefined || link['left-ltp-name'] === null) ? '' : link['left-ltp-name'];
                                var destLtpName = (link['right-ltp-name'] === undefined || link['right-ltp-name'] === null) ? '' : link['right-ltp-name'];

                                var elineType = '';
                                var sourceNodes = '';
                                var destNodes = '';

                                if (relation !== '') {
                                    var sRelation = relation.split('-');
                                    var sIndex = strChineseIndex.indexOf(sRelation[0]);
                                    if (sIndex !== -1) {
                                        elineType = strChineseIndex[sIndex];
                                    }

                                    angular.forEach(sRelation, function(sInOut, index) {
                                        if (index !== 0) {
                                            if (sInOut) {
                                                var aInOut = sInOut.split(':');
                                                if (index == 1) {
                                                    sourceNodes = aInOut[0] + ':' + aInOut[1];
                                                }

                                                if ((sRelation.length - 1) !== index) {
                                                    destNodes += aInOut[2] + ':' + aInOut[3] + ',';
                                                } else {
                                                    destNodes += aInOut[2] + ':' + aInOut[3];
                                                }
                                            }
                                        }
                                    });
                                }

                                var linkTitle = $filter('translate')('Eline UserLabel') + ":  " + elineuserlabel + "<br>";
                                linkTitle += $filter('translate')('Role') + ":  " + $filter('translate')(sRole) + "<br>";
                                linkTitle += $filter('translate')('Eline Type') + ":  " + $filter('translate')(elineType) + "<br>";
                                linkTitle += $filter('translate')('Source Node') + ":  " + sourceNodes + "<br>";
                                linkTitle += $filter('translate')('Destination Node') + ":  " + destNodes + "<br>";
                                linkTitle += $filter('translate')('Source Port') + ":  " + sourceLtpUserlabel + "<br>";
                                linkTitle += $filter('translate')('Destination Port') + ":  " + destLtpUserlabel + "<br>";
                                linkTitle += $filter('translate')('Source Vlan') + ":  " + leftVlanList + "<br>";
                                linkTitle += $filter('translate')('Destination Vlan') + ": " + rightVlanList + "<br>";
                                linkTitle += $filter('translate')('operate-status') + ":  " + $filter('translate')(operateStatus);

                                var visLink = {
                                    id: link.id + '$%@*^#' + link['eline-id'] + '$%@*^#' + elineuserlabel,
                                    elineId: link['eline-id'],
                                    role: sRole,
                                    elineType: elineType,
                                    sourceNodes: sourceNodes,
                                    destNodes: destNodes,
                                    leftLtpId: leftLtpId,
                                    rightLtpId: rightLtpId,
                                    leftVlanList: leftVlanList,
                                    rightVlanList: rightVlanList,
                                    operateStatus: operateStatus,
                                    userlabel: elineuserlabel,
                                    from: link['left-node-id'],
                                    to: link['right-node-id'],
                                    color: linkColor,
                                    sd: link['left-node-user-label'] + link['right-node-user-label'],
                                    title: linkTitle
                                };

                                if (aEdges.length === 0) {
                                    aEdges.push(visLink);
                                } else {
                                    var flag = true;
                                    angular.forEach(aEdges, function(edge) {
                                        var a = edge.from + edge.to;
                                        var b = edge.to + edge.from;
                                        var c = visLink.from + visLink.to;

                                        if (c == b || c == a) {
                                            if (edge.elineId != visLink.elineId) {
                                                if (oSameNodeEline[a] === undefined && oSameNodeEline[b] === undefined) {
                                                    oSameNodeEline[a] = {
                                                        data: [edge, visLink],
                                                        elineList: [{
                                                            elineId: edge.elineId,
                                                            userlabel: edge.userlabel
                                                        }, {
                                                            elineId: visLink.elineId,
                                                            userlabel: visLink.userlabel
                                                        }]
                                                    };
                                                } else if (oSameNodeEline[b] === undefined && oSameNodeEline[a] !== undefined) {
                                                    oSameNodeEline[a].data.push(visLink);
                                                    oSameNodeEline[a].elineList.push({
                                                        elineId: visLink.elineId,
                                                        userlabel: visLink.userlabel
                                                    });
                                                } else if (oSameNodeEline[b] !== undefined && oSameNodeEline[a] === undefined) {
                                                    oSameNodeEline[b].data.push(visLink);
                                                    oSameNodeEline[a].elineList.push({
                                                        elineId: visLink.elineId,
                                                        userlabel: visLink.userlabel
                                                    });
                                                }
                                                edge.id += '$%@*^#' + 'sameNode';
                                                edge.width = 8;
                                                flag = false;
                                            }
                                        }
                                    });

                                    if (flag) {
                                        aEdges.push(visLink);
                                    }
                                }

                                /*if(!svc.IsEdgeExist(linksMap, link['left-node-id'], link['right-node-id'])){
                                    aEdges.push(visLink);
                                    linksMap[visLink.from + ":" + visLink.to] = visLink.id;
                                }else{

                                }*/
                            }
                        });
                    }

                    angular.forEach(aEdges, function(edge, index) {
                        if (edge.id.indexOf('$%@*^#sameNode') !== -1) {
                            var a = edge.from + edge.to;
                            var b = edge.to + edge.from;
                            var name = '';

                            edge.title = $filter('translate')('Eline List') + ": ";
                            if (oSameNodeEline[a] === undefined && oSameNodeEline[b] !== undefined) {
                                name = b;
                            } else if (oSameNodeEline[a] !== undefined && oSameNodeEline[b] === undefined) {
                                name = a;
                            }

                            if (oSameNodeEline[name] && oSameNodeEline[name].elineList) {
                                for (var i = 0; i < oSameNodeEline[name].elineList.length; i += 4) {
                                    if (oSameNodeEline[name].elineList[i] && oSameNodeEline[name].elineList[i].userlabel) {
                                        edge.title += oSameNodeEline[name].elineList[i].userlabel;
                                    }

                                    if (oSameNodeEline[name].elineList[i + 1] && oSameNodeEline[name].elineList[i + 1].userlabel) {
                                        edge.title += ',' + oSameNodeEline[name].elineList[i + 1].userlabel;
                                    }

                                    if (oSameNodeEline[name].elineList[i + 2] && oSameNodeEline[name].elineList[i + 2].userlabel) {
                                        edge.title += ',' + oSameNodeEline[name].elineList[i + 2].userlabel;
                                    }

                                    if (oSameNodeEline[name].elineList[i + 3] && oSameNodeEline[name].elineList[i + 3].userlabel) {
                                        edge.title += ',' + oSameNodeEline[name].elineList[i + 3].userlabel + '<br>';
                                    }
                                }
                            }
                        }
                    });
                }

                var visData = {
                    nodes: aNodes,
                    edges: aEdges
                };

                cb(visData, aNodes, oSameNodeEline);
            }

            //formatElineData(data, cb);

            $.ajax({
                url: TopologyRestangular.configuration.baseUrl + "/restconf/operations/topo-cloud:get-all-eline",
                contentType: "application/json",
                type: 'post',
                async: false,
                dataType: "json",
                success: function(response) {
                    var resultList = response.output;
                    if (resultList === undefined) {
                        console.log("The period you select has no data!");
                    } else {
                        formatElineData(response, cb);
                    }
                }
            });
        };

        svc.getPwTopology = function(eline, cb) {
            function formatPwData(data, cb) {
                if (data && data.output) {
                    var aNodes = []; //vis node
                    var aEdges = []; // vis edge
                    var linksMap = {}; // edge form to
                    var aExtNodes = []; // ext node
                    var aYesCloudNode = [];
                    var aNoCloudNode = [];
                    var aElineExtNode = [];


                    // 解析内部节点转换成vis的nodes格式
                    if (data.output['pw-node-list']) {
                        angular.forEach(data.output['pw-node-list'], function(node, index) {
                            if (node.id.indexOf('openflow') >= 0 && (!svc.IsNodeExist(aNodes, node.id))) {
                                var visNode = svc.formatVisNodes(node, 'sdn');
                                aNodes.push(visNode);
                            }
                        });
                    }

                    // 解析外部节点转换成vis的nodes格式
                    if (data.output['pw-ext-node-list']) {
                        angular.forEach(data.output['pw-ext-node-list'], function(extNode, index) {
                            if (!svc.IsNodeExist(aNodes, extNode.id)) {
                                var visNode = svc.formatVisNodes(extNode, 'ext');
                                aNodes.push(visNode);

                                if (!svc.IsNodeExist(aExtNodes, visNode.id)) {
                                    aExtNodes.push(visNode.id);
                                }
                            }
                        });
                    }

                    //获取eline的is working
                    var isWorkingStatus = '';
                    $.ajax({
                        url: TopologyRestangular.configuration.baseUrl + "/restconf/operations/raisecom-eline:protection-link",
                        contentType: "application/json",
                        type: 'post',
                        async: false,
                        dataType: "json",
                        data: JSON.stringify({ 'input': { 'eline-id': eline.id } }),
                        success: function(response) {
                            var resultList = response.output;
                            if (resultList === undefined) {
                                console.log("The period you select has no data!");
                            } else {
                                if (resultList.result === true) {
                                    if (resultList.master === true) {
                                        isWorkingStatus = 'master';
                                    } else if (resultList.slave === true) {
                                        isWorkingStatus = 'slave';
                                    }
                                } else {
                                    isWorkingStatus = 'false';
                                }
                            }
                        },
                        error: function(data) {
                            console.log(data);
                        }
                    });

                    //解析内部link转换成is的edges数据格式
                    if (data.output['pw-link-list']) {
                        angular.forEach(data.output['pw-link-list'], function(link, index) {
                            if (link['left-node-id'] && link['right-node-id'] && !svc.IsEdgeExist(linksMap, link['left-node-id'], link['right-node-id'])) {
                                var linkColor = '';
                                var title = '';

                                var workStatus = '';
                                if (isWorkingStatus == 'false') {
                                    workStatus = $filter('translate')('is working');
                                } else {
                                    if (isWorkingStatus == link['role'].toLowerCase()) {
                                        workStatus = $filter('translate')('is working');
                                    } else {
                                        workStatus = $filter('translate')('no working');
                                    }
                                }

                                if (link['operate-status'] == 'operate-down') {
                                    linkColor = 'red';
                                } else if (link['operate-status'] == 'operate-up') {
                                    if (isWorkingStatus == 'false') {
                                        linkColor = 'green';
                                    } else {
                                        if (isWorkingStatus == link['role'].toLowerCase()) {
                                            linkColor = 'green';
                                        } else {
                                            linkColor = 'orange';
                                        }
                                    }

                                }

                                var elineName = (link['eline-name'] === undefined || link['eline-name'] === null) ? '' : link['eline-name'];
                                var pwUserlabel = (link['pw-userlabel'] === undefined || link['pw-userlabel'] === null) ? '' : link['pw-userlabel'];
                                var pwName = (link['pw-name'] === undefined || link['pw-name'] === null) ? '' : link['pw-name'];
                                var leftNodeId = (link['left-node-id'] === undefined || link['left-node-id'] === null) ? '' : link['left-node-id'];
                                var rightNodeId = (link['right-node-id'] === undefined || link['right-node-id'] === null) ? '' : link['right-node-id'];
                                var operateStatus = (link['operate-status'] === undefined || link['operate-status'] === null) ? '' : link['operate-status'];
                                var pwRole = (link['role'] === undefined || link['role'] === null) ? '' : link['role'].toLowerCase();
                                var megId = (link['meg-id'] === undefined || link['meg-id'] === null) ? '' : link['meg-id'];

                                var leftNodeUserLabel = (link['left-node-user-label'] === undefined || link['left-node-user-label'] === null) ? '' : link['left-node-user-label'];
                                var rightNodeUserLabel = (link['right-node-user-label'] === undefined || link['right-node-user-label'] === null) ? '' : link['right-node-user-label'];
                                var leftLtpUserlabel = (link['left-ltp-user-label'] === undefined || link['left-ltp-user-label'] === null) ? '' : link['left-ltp-user-label'];
                                var rightLtpUserlabel = (link['right-ltp-user-label'] === undefined || link['right-ltp-user-label'] === null) ? '' : link['right-ltp-user-label'];

                                var leftNodeName = (link['left-node-name'] === undefined || link['left-node-name'] === null) ? '' : link['left-node-name'];
                                var rightNodeName = (link['right-node-name'] === undefined || link['right-node-name'] === null) ? '' : link['right-node-name'];
                                var leftLtpName = (link['left-ltp-name'] === undefined || link['left-ltp-name'] === null) ? '' : link['left-ltp-name'];
                                var rightLtpName = (link['right-ltp-name'] === undefined || link['right-ltp-name'] === null) ? '' : link['right-ltp-name'];


                                title = $filter('translate')('Eline Name') + ":  " + elineName + "<br>";
                                title += $filter('translate')('PW UserLabel') + ":  " + pwName + "<br>";
                                title += $filter('translate')('Source Node') + ":  " + leftNodeUserLabel + "<br>";
                                title += $filter('translate')('Destination Node') + ":  " + rightNodeUserLabel + "<br>";
                                title += $filter('translate')('Operate Status') + ":  " + $filter('translate')(operateStatus) + "<br>";
                                title += $filter('translate')('IS Working') + ":  " + workStatus + "<br>";
                                title += $filter('translate')('Role') + ":  " + $filter('translate')(pwRole) + "<br>";


                                //获取bfd状态
                                var bfdStatus = '';
                                $.ajax({
                                    url: TopologyRestangular.configuration.baseUrl + "/restconf/operations/sal-netconf:oam-status",
                                    contentType: "application/json",
                                    type: 'post',
                                    async: false,
                                    dataType: "json",
                                    data: JSON.stringify({ 'input': { 'eline-id': eline.id, 'meg-id': megId } }),
                                    success: function(response) {
                                        var resultList = response.output;
                                        if (resultList === undefined) {
                                            console.log("The period you select has no data!");
                                        } else {
                                            if (resultList['enable-oam-result'] === true) {
                                                if (resultList['oam-bfd-status']) {
                                                    if (resultList['oam-bfd-status'].state == 'up') {
                                                        bfdStatus = 'up';
                                                    } else {
                                                        bfdStatus = 'down';
                                                    }
                                                }
                                            } else {
                                                bfdStatus = '';
                                            }
                                        }
                                    },
                                    error: function(data) {
                                        console.log(data);
                                    }
                                });

                                title += $filter('translate')('Bfd Status') + ":  " + $filter('translate')(bfdStatus);

                                var visLink = {
                                    id: link.id + '$%@*^#' + eline.id + '$%@*^#' + link['pw-id'] + '$%@*^#' + eline.userlabel + '$%@*^#' + pwUserlabel,
                                    from: link['left-node-id'],
                                    to: link['right-node-id'],
                                    color: linkColor,
                                    title: title,
                                    pwid: link['pw-id'],
                                    sd: link['left-node-id'] + link['right-node-id'],
                                    elineid: eline.id
                                };

                                aEdges.push(visLink);
                                linksMap[visLink.from + ":" + visLink.to] = visLink.id;
                            }
                        });
                    }

                    //判断eline的原宿节点为外部节点的集合
                    angular.forEach(eline.nodes, function(node) {
                        if (-1 !== aExtNodes.indexOf(node)) {
                            aElineExtNode.push(node);
                        }
                    });

                    //解析外部link组合成edges的数据格式
                    if (data.output['pw-ext-link-list']) {
                        angular.forEach(data.output['pw-ext-link-list'], function(extLink, index) {
                            if (extLink['left-node-id'] && extLink['right-node-id'] && !svc.IsEdgeExist(linksMap, extLink['left-node-id'], extLink['right-node-id'])) {
                                var linkColor = '';
                                var title = '';

                                var workStatus = '';
                                if (isWorkingStatus == 'false') {
                                    workStatus = $filter('translate')('is working');
                                } else {
                                    if (isWorkingStatus == extLink['role'].toLowerCase()) {
                                        workStatus = $filter('translate')('is working');
                                    } else {
                                        workStatus = $filter('translate')('no working');
                                    }
                                }

                                if (extLink['operate-status'] == 'operate-down') {
                                    linkColor = 'red';
                                } else if (extLink['operate-status'] == 'operate-up') {
                                    if (isWorkingStatus == 'false') {
                                        linkColor = 'green';
                                    } else {
                                        if (isWorkingStatus == extLink['role'].toLowerCase()) {
                                            linkColor = 'green';
                                        } else {
                                            linkColor = 'orange';
                                        }
                                    }

                                }

                                var elineName = (extLink['eline-name'] === undefined || extLink['eline-name'] === null) ? '' : extLink['eline-name'];
                                var pwUserlabel = (extLink['pw-userlabel'] === undefined || extLink['pw-userlabel'] === null) ? '' : extLink['pw-userlabel'];
                                var pwName = (extLink['pw-name'] === undefined || extLink['pw-name'] === null) ? '' : extLink['pw-name'];
                                var leftNodeId = (extLink['left-node-id'] === undefined || extLink['left-node-id'] === null) ? '' : extLink['left-node-id'];
                                var rightNodeId = (extLink['right-node-id'] === undefined || extLink['right-node-id'] === null) ? '' : extLink['right-node-id'];
                                var operateStatus = (extLink['operate-status'] === undefined || extLink['operate-status'] === null) ? '' : extLink['operate-status'];
                                var pwRole = (extLink['role'] === undefined || extLink['role'] === null) ? '' : extLink['role'].toLowerCase();
                                var megId = (extLink['meg-id'] === undefined || extLink['meg-id'] === null) ? '' : extLink['meg-id'];

                                var leftNodeUserLabel = (extLink['left-node-user-label'] === undefined || extLink['left-node-user-label'] === null) ? '' : extLink['left-node-user-label'];
                                var rightNodeUserLabel = (extLink['right-node-user-label'] === undefined || extLink['right-node-user-label'] === null) ? '' : extLink['right-node-user-label'];
                                var leftLtpUserlabel = (extLink['left-ltp-user-label'] === undefined || extLink['left-ltp-user-label'] === null) ? '' : extLink['left-ltp-user-label'];
                                var rightLtpUserlabel = (extLink['right-ltp-user-label'] === undefined || extLink['right-ltp-user-label'] === null) ? '' : extLink['right-ltp-user-label'];

                                var leftNodeName = (extLink['left-node-name'] === undefined || extLink['left-node-name'] === null) ? '' : extLink['left-node-name'];
                                var rightNodeName = (extLink['right-node-name'] === undefined || extLink['right-node-name'] === null) ? '' : extLink['right-node-name'];
                                var leftLtpName = (extLink['left-ltp-name'] === undefined || extLink['left-ltp-name'] === null) ? '' : extLink['left-ltp-name'];
                                var rightLtpName = (extLink['right-ltp-name'] === undefined || extLink['right-ltp-name'] === null) ? '' : extLink['right-ltp-name'];

                                title += $filter('translate')('Eline Name') + ':  ' + elineName + '<br>';
                                title += $filter('translate')('PW UserLabel') + ':  ' + pwName + "<br>";
                                title += $filter('translate')('Source Node') + ':  ' + leftNodeUserLabel + '<br>';
                                title += $filter('translate')('Destination Node') + ':  ' + rightNodeUserLabel + "<br>";
                                title += $filter('translate')('Operate Status') + ':  ' + $filter('translate')(operateStatus) + "<br>";
                                title += $filter('translate')('IS Working') + ':  ' + workStatus + "<br>";
                                title += $filter('translate')('Role') + ':  ' + $filter('translate')(pwRole) + "<br>";

                                //获取bfd状态
                                var bfdStatus = '';
                                $.ajax({
                                    url: TopologyRestangular.configuration.baseUrl + "/restconf/operations/sal-netconf:oam-status",
                                    contentType: "application/json",
                                    type: 'post',
                                    async: false,
                                    dataType: "json",
                                    data: JSON.stringify({ 'input': { 'eline-id': eline.id, 'meg-id': megId } }),
                                    success: function(response) {
                                        var resultList = response.output;
                                        if (resultList === undefined) {
                                            console.log("The period you select has no data!");
                                        } else {
                                            if (resultList['enable-oam-result'] === true) {
                                                if (resultList['oam-bfd-status']) {
                                                    if (resultList['oam-bfd-status'].state == 'up') {
                                                        bfdStatus = 'up';
                                                    } else {
                                                        bfdStatus = 'down';
                                                    }
                                                }
                                            } else {
                                                bfdStatus = '';
                                            }
                                        }
                                    },
                                    error: function(data) {
                                        console.log(data);
                                    }
                                });

                                title += $filter('translate')('Bfd Status') + ":  " + $filter('translate')(bfdStatus);

                                var visLink = {
                                    id: extLink.id + '$%@*^#' + eline.id + '$%@*^#' + extLink['pw-id'] + '$%@*^#' + eline.userlabel + '$%@*^#' + pwUserlabel,
                                    from: extLink['left-node-id'],
                                    to: extLink['right-node-id'],
                                    color: linkColor,
                                    title: title,
                                    sd: extLink['left-node-id'] + extLink['right-node-id'],
                                    pwid: extLink['pw-id'],
                                    elineid: eline.id
                                };

                                aEdges.push(visLink);
                                linksMap[visLink.from + ":" + visLink.to] = visLink.id;
                            }
                        });
                    }

                    //删除外部节点与外部节点之间的link
                    var closeEdge = [];
                    angular.forEach(aEdges, function(edge, index) {
                        var fromIndex = aExtNodes.indexOf(edge.from);
                        var toIndex = aExtNodes.indexOf(edge.to);
                        var fromElineIndex = aElineExtNode.indexOf(edge.from);
                        var toElineIndex = aElineExtNode.indexOf(edge.to);

                        if (fromIndex !== -1 && toIndex !== -1) {
                            if (fromElineIndex !== -1 || toElineIndex !== -1) {
                                closeEdge.push(edge);
                            }
                        } else {
                            closeEdge.push(edge);
                        }
                    });

                    //原始数据保存
                    var initData = {
                        nodes: aNodes,
                        edges: closeEdge
                    };
                    var openInitData = {};
                    $.extend(true, openInitData, initData);

                    //判断link的from或to的节点是否为画云的节点
                    angular.forEach(closeEdge, function(edge, index) {
                        var IsExtNodeFrom = aExtNodes.indexOf(edge.from);
                        var IsExtNodeTo = aExtNodes.indexOf(edge.to);
                        var fromIndex = aElineExtNode.indexOf(edge.from);
                        var toIndex = aElineExtNode.indexOf(edge.to);

                        if (IsExtNodeFrom !== -1) {
                            if (fromIndex !== -1) {
                                aNoCloudNode.push(edge.from);
                            } else {
                                var topoId = '';
                                angular.forEach(aNodes, function(node, index) {
                                    if (node.id === edge.from) {
                                        topoId = node.topoId;
                                    }
                                });

                                var flag = false;
                                angular.forEach(aYesCloudNode, function(node, index) {
                                    if (node.id == edge.from) {
                                        flag = true;
                                        return;
                                    }

                                });

                                if (!flag) {
                                    aYesCloudNode.push({
                                        id: edge.from,
                                        topoId: topoId
                                    });
                                }
                            }
                        }

                        if (IsExtNodeTo !== -1) {
                            if (toIndex !== -1) {
                                aNoCloudNode.push(edge.to);
                            } else {
                                var topoIdTo = '';
                                angular.forEach(aNodes, function(node, index) {
                                    if (node.id === edge.to) {
                                        topoIdTo = node.topoId;
                                    }
                                });
                                var flagTo = false;
                                angular.forEach(aYesCloudNode, function(node, index) {
                                    if (node.id == edge.to) {
                                        flagTo = true;
                                        return;
                                    }

                                });

                                if (!flagTo) {
                                    aYesCloudNode.push({
                                        id: edge.to,
                                        topoId: topoIdTo
                                    });
                                }
                            }
                        }
                    });

                    //组合不同拓扑id下的外部节点
                    var aYesCloudTopologyId = {};
                    angular.forEach(aYesCloudNode, function(node, index) {
                        if (!aYesCloudTopologyId.hasOwnProperty(node.topoId)) {
                            aYesCloudTopologyId[node.topoId] = [node];
                        } else {
                            aYesCloudTopologyId[node.topoId].push(node);
                        }
                    });

                    //绘制多个云
                    var aCloseNodes = [];
                    for (var name in aYesCloudTopologyId) {
                        //删除画云的外部节点
                        var nodes = aYesCloudTopologyId[name];
                        var newVisNodes = svc.deleteExtCloudNodes(nodes, aNodes);

                        aNodes.length = 0;
                        $.extend(true, aNodes, newVisNodes);

                        /*for (var i = 0; i < nodes.length; i++) {
                            for (var n = 0; n < aNodes.length; n++) {
                                if (nodes[i].id == aNodes[n].id) {
                                    aNodes.splice(n, 1);
                                }
                            }
                        }*/

                        var cloudNode = {
                            id: 'cloudNodeId' + '$%@*^#' + name,
                            size: 45,
                            label: 'Cloud:' + name,
                            topoId: name,
                            group: 'cloud'
                        };
                        aNodes.push(cloudNode);


                        //link中存在画云的节点换成云节点
                        for (var m = 0; m < nodes.length; m++) {
                            for (var j = 0; j < closeEdge.length; j++) {
                                if (closeEdge[j].from == nodes[m].id) {
                                    closeEdge[j].from = cloudNode.id;
                                }

                                if (closeEdge[j].to == nodes[m].id) {
                                    closeEdge[j].to = cloudNode.id;
                                }

                                if (closeEdge[j].to.indexOf('cloudNodeId$%@*^#') !== -1 || closeEdge[j].from.indexOf('cloudNodeId$%@*^#') !== -1) {
                                    //closeEdge[j].style = 'dash-line';
                                    closeEdge[j].color = 'blue';
                                    closeEdge[j].backtitle = closeEdge[j].title;
                                    delete closeEdge[j].title;
                                }

                                closeEdge[j].sd = closeEdge[j].from + closeEdge[j].to;

                            }
                        }
                    }


                    //repeat
                    //var newACloseEdges = svc.deleteRepeatEdges(closeEdge);

                    var visData = {
                        nodes: aNodes,
                        edges: closeEdge
                    };
                    cb(visData, openInitData, aYesCloudTopologyId);
                }
            }

            //formatPwData(data, cb);

            //get spectical eline's pw
            return svc.base().post('topo-cloud:get-pw-by-eline', { input: { 'eline-id': eline.id } }).then(function(data) {
                formatPwData(data, cb);
            });
        };

        svc.getLspWorkStatus = function(value, role, status) {
            var isWorkingStatus = '';
            var url = '/restconf/operations/raisecom-tunnel:protection-link';
            var data = {
                'input': {
                    'tunnel-id': value
                }
            };

            $.ajax({
                url: TopologyRestangular.configuration.baseUrl + url,
                contentType: "application/json",
                type: 'post',
                async: false,
                dataType: "json",
                data: JSON.stringify(data),
                success: function(response) {
                    var resultList = response.output;
                    if (resultList === undefined) {
                        console.log("The period you select has no data!");
                    } else {
                        if (resultList.result === true) {
                            if (resultList.master === true) {
                                isWorkingStatus = 'master';
                            } else if (resultList.slave === true) {
                                isWorkingStatus = 'slave';
                            }
                        } else {
                            isWorkingStatus = 'false';
                        }
                    }
                },
                error: function(data) {
                    console.log(data);
                }
            });

            var workStatus = '';
            if (isWorkingStatus == 'false') {
                workStatus = $filter('translate')('is working');
            } else {
                if (isWorkingStatus == role.toLowerCase()) {
                    workStatus = $filter('translate')('is working');
                } else {
                    workStatus = $filter('translate')('no working');
                }
            }

            if (status == 'operate-down') {
                linkColor = 'red';
            } else if (status == 'operate-up') {
                if (isWorkingStatus == 'false') {
                    linkColor = 'green';
                } else {
                    if (isWorkingStatus == role.toLowerCase()) {
                        linkColor = 'green';
                    } else {
                        linkColor = 'orange';
                    }
                }

            }

            var cbData = {
                workStatus: workStatus,
                linkColor: linkColor
            };

            return cbData;
        };

        svc.getLspTopology = function(tunnel, cb) {
            function formatLspData(data, cb) {
                if (data && data.output) {
                    var aNodes = []; //vis node
                    var aEdges = []; // vis edge
                    var linksMap = {}; // edge form to
                    var aExtNodes = []; // ext node
                    var aYesCloudNode = [];
                    var aNoCloudNode = [];
                    var aElineExtNode = [];


                    // 解析内部节点转换成vis的nodes格式
                    if (data.output['lsp-node-list']) {
                        angular.forEach(data.output['lsp-node-list'], function(node, index) {
                            if (node.id.indexOf('openflow') >= 0 && (!svc.IsNodeExist(aNodes, node.id))) {
                                var visNode = svc.formatVisNodes(node, 'sdn');
                                aNodes.push(visNode);
                            }
                        });
                    }

                    // 解析外部节点转换成vis的nodes格式
                    if (data.output['lsp-ext-node-list']) {
                        angular.forEach(data.output['lsp-ext-node-list'], function(extNode, index) {
                            if (!svc.IsNodeExist(aNodes, extNode.id)) {
                                var visNode = svc.formatVisNodes(extNode, 'ext');
                                aNodes.push(visNode);

                                if (!svc.IsNodeExist(aExtNodes, visNode.id)) {
                                    aExtNodes.push(visNode.id);
                                }
                            }
                        });
                    }

                    //解析内部link转换成is的edges数据格式
                    if (data.output['lsp-link-list']) {
                        angular.forEach(data.output['lsp-link-list'], function(link, index) {
                            if (link['left-node-id'] && link['right-node-id'] && !svc.IsEdgeExist(linksMap, link['left-node-id'], link['right-node-id'])) {
                                var linkColor = '';
                                var title = '';

                                var tunnelid = (link['tunnel-id'] === undefined || link['tunnel-id'] === null) ? '' : link['tunnel-id'];
                                var lspid = (link['lsp-id'] === undefined || link['lsp-id'] === null) ? '' : link['lsp-id'];
                                var lspUserlabel = (link['lsp-userlabel'] === undefined || link['lsp-userlabel'] === null) ? '' : link['lsp-userlabel'];
                                var leftNodeId = (link['left-node-id'] === undefined || link['left-node-id'] === null) ? '' : link['left-node-id'];
                                var rightNodeId = (link['right-node-id'] === undefined || link['right-node-id'] === null) ? '' : link['right-node-id'];
                                var operateStatus = (link['operate-status'] === undefined || link['operate-status'] === null) ? '' : link['operate-status'];
                                var pwRole = (link['role'] === undefined || link['role'] === null) ? '' : link['role'].toLowerCase();
                                var forwardvlan = (link['forward-vlan'] === undefined || link['forward-vlan'] === null) ? '' : link['forward-vlan'];
                                var backwordvlan = (link['backword-vlan'] === undefined || link['backword-vlan'] === null) ? '' : link['backword-vlan'];
                                var forwardlabel = (link['forward-label'] === undefined || link['forward-label'] === null) ? '' : link['forward-label'];
                                var backwardlabel = (link['backward-label'] === undefined || link['backward-label'] === null) ? '' : link['backward-label'];

                                var leftLtpId = (link['left-ltp-id'] === undefined || link['left-ltp-id'] === null) ? '' : link[' left-ltp-id'];
                                var rightLtpId = (link['right-ltp-id'] === undefined || link['right-ltp-id'] === null) ? '' : link['right-ltp-id'];

                                var leftNodeUserLabel = (link['left-node-user-label'] === undefined || link['left-node-user-label'] === null) ? '' : link['left-node-user-label'];
                                var rightNodeUserLabel = (link['right-node-user-label'] === undefined || link['right-node-user-label'] === null) ? '' : link['right-node-user-label'];
                                var leftLtpUserlabel = (link['left-ltp-user-label'] === undefined || link['left-ltp-user-label'] === null) ? '' : link['left-ltp-user-label'];
                                var rightLtpUserlabel = (link['right-ltp-user-label'] === undefined || link['right-ltp-user-label'] === null) ? '' : link['right-ltp-user-label'];

                                var leftNodeName = (link['left-node-name'] === undefined || link['left-node-name'] === null) ? '' : link['left-node-name'];
                                var rightNodeName = (link['right-node-name'] === undefined || link['right-node-name'] === null) ? '' : link['right-node-name'];
                                var leftLtpName = (link['left-ltp-name'] === undefined || link['left-ltp-name'] === null) ? '' : link['left-ltp-name'];
                                var rightLtpName = (link['right-ltp-name'] === undefined || link['right-ltp-name'] === null) ? '' : link['right-ltp-name'];


                                title += $filter('translate')('Left Node') + ":" + leftNodeUserLabel + "<br>";
                                title += $filter('translate')('Right Node') + ":" + rightNodeUserLabel + "<br>";
                                title += $filter('translate')('Left LTP') + ":" + leftLtpUserlabel + "<br>";
                                title += $filter('translate')('Right LTP') + ":" + rightLtpUserlabel + "<br>";
                                title += $filter('translate')('Forward Label') + ":" + forwardlabel + "<br>";
                                title += $filter('translate')('Backword Label') + ":" + backwardlabel + "<br>";
                                title += $filter('translate')('tunnel ID') + ":" + tunnelid + "<br>";
                                title += $filter('translate')('LSP UserLabel') + ":" + lspUserlabel + "<br>";
                                title += $filter('translate')('Vlan') + ":" + forwardvlan + "<br>";
                                //title += $filter('translate')('Backword Vlan') + ":<font color='#fff'>" + backwordvlan + "</font><br>";

                                /*worksatatus*/
                                var workStatusData = svc.getLspWorkStatus(tunnelid, pwRole, operateStatus);
                                linkColor = workStatusData.linkColor;
                                /*worksatatus*/
                                title += $filter('translate')('IS Working') + ":  " + workStatusData.workStatus + "<br>";
                                title += $filter('translate')('Role') + ":" + $filter('translate')(pwRole) + "<br>";
                                title += $filter('translate')('operate-status') + ":" + $filter('translate')(operateStatus);

                                var visLink = {
                                    id: link.id,
                                    tunnelid: link['tunnel-id'],
                                    from: link['left-node-id'],
                                    to: link['right-node-id'],
                                    color: linkColor,
                                    title: title,
                                    sd: link['left-node-id'] + link['right-node-id'],
                                    lspid: link['lsp-id']
                                };

                                aEdges.push(visLink);
                                linksMap[visLink.from + ":" + visLink.to] = visLink.id;
                            }
                        });
                    }

                    //判断eline的原宿节点为外部节点的集合
                    angular.forEach(tunnel.nodes, function(node) {
                        if (-1 !== aExtNodes.indexOf(node)) {
                            aElineExtNode.push(node);
                        }
                    });

                    //解析外部link组合成edges的数据格式
                    if (data.output['lsp-ext-link-list']) {
                        angular.forEach(data.output['lsp-ext-link-list'], function(extLink, index) {
                            if (extLink['left-node-id'] && extLink['right-node-id'] && !svc.IsEdgeExist(linksMap, extLink['left-node-id'], extLink['right-node-id'])) {
                                var linkColor = '';
                                var title = '';

                                var tunnelid = (extLink['tunnel-id'] === undefined || extLink['tunnel-id'] === null) ? '' : extLink['tunnel-id'];
                                var lspid = (extLink['lsp-id'] === undefined || extLink['lsp-id'] === null) ? '' : extLink['lsp-id'];
                                var lspUserlabel = (extLink['lsp-userlabel'] === undefined || extLink['lsp-userlabel'] === null) ? '' : extLink['lsp-userlabel'];
                                var leftNodeId = (extLink['left-node-id'] === undefined || extLink['left-node-id'] === null) ? '' : extLink['left-node-id'];
                                var rightNodeId = (extLink['right-node-id'] === undefined || extLink['right-node-id'] === null) ? '' : extLink['right-node-id'];
                                var operateStatus = (extLink['operate-status'] === undefined || extLink['operate-status'] === null) ? '' : extLink['operate-status'];
                                var pwRole = (extLink['role'] === undefined || extLink['role'] === null) ? '' : extLink['role'].toLowerCase();
                                var forwardvlan = (extLink['forward-vlan'] === undefined || extLink['forward-vlan'] === null) ? '' : extLink['forward-vlan'];
                                var backwordvlan = (extLink['backword-vlan'] === undefined || extLink['backword-vlan'] === null) ? '' : extLink['backword-vlan'];
                                var forwardlabel = (extLink['forward-label'] === undefined || extLink['forward-label'] === null) ? '' : extLink['forward-label'];
                                var backwardlabel = (extLink['backward-label'] === undefined || extLink['backward-label'] === null) ? '' : extLink['backward-label'];

                                var leftLtpId = (extLink['left-ltp-id'] === undefined || extLink['left-ltp-id'] === null) ? '' : extLink[' left-ltp-id'];
                                var rightLtpId = (extLink['right-ltp-id'] === undefined || extLink['right-ltp-id'] === null) ? '' : extLink['right-ltp-id'];

                                var leftNodeUserLabel = (extLink['left-node-user-label'] === undefined || extLink['left-node-user-label'] === null) ? '' : extLink['left-node-user-label'];
                                var rightNodeUserLabel = (extLink['right-node-user-label'] === undefined || extLink['right-node-user-label'] === null) ? '' : extLink['right-node-user-label'];
                                var leftLtpUserlabel = (extLink['left-ltp-user-label'] === undefined || extLink['left-ltp-user-label'] === null) ? '' : extLink['left-ltp-user-label'];
                                var rightLtpUserlabel = (extLink['right-ltp-user-label'] === undefined || extLink['right-ltp-user-label'] === null) ? '' : extLink['right-ltp-user-label'];

                                var leftNodeName = (extLink['left-node-name'] === undefined || extLink['left-node-name'] === null) ? '' : extLink['left-node-name'];
                                var rightNodeName = (extLink['right-node-name'] === undefined || extLink['right-node-name'] === null) ? '' : extLink['right-node-name'];
                                var leftLtpName = (extLink['left-ltp-name'] === undefined || extLink['left-ltp-name'] === null) ? '' : extLink['left-ltp-name'];
                                var rightLtpName = (extLink['right-ltp-name'] === undefined || extLink['right-ltp-name'] === null) ? '' : extLink['right-ltp-name'];


                                title += $filter('translate')('Left Node') + ':  ' + leftNodeUserLabel + '<br>';
                                title += $filter('translate')('Right Node') + ':  ' + rightNodeUserLabel + "<br>";
                                title += $filter('translate')('Forward Label') + ':  ' + forwardlabel + "<br>";
                                title += $filter('translate')('Backword Label') + ':  ' + backwardlabel + "<br>";
                                title += $filter('translate')('Left LTP') + ': ' + leftLtpUserlabel + "<br>";
                                title += $filter('translate')('Right LTP') + ':  ' + rightLtpUserlabel + "<br>";
                                title += $filter('translate')('tunnel ID') + ':  ' + tunnelid + '<br>';
                                title += $filter('translate')('LSP UserLabel') + ':  ' + lspUserlabel + "<br>";
                                title += $filter('translate')('Vlan') + ':  ' + forwardvlan + "<br>";

                                //title += $filter('translate')('Backword Vlan') + ':  <font color="#fff">' + backwordvlan + "</font><br>";

                                /*worksatatus*/
                                var workStatusData = svc.getLspWorkStatus(tunnelid, pwRole, operateStatus);
                                linkColor = workStatusData.linkColor;
                                /*worksatatus*/
                                title += $filter('translate')('IS Working') + ":  " + workStatusData.workStatus + "<br>";
                                title += $filter('translate')('Role') + ":" + $filter('translate')(pwRole) + "<br>";
                                title += $filter('translate')('operate-status') + ":" + $filter('translate')(operateStatus);

                                var visLink = {
                                    id: extLink.id,
                                    tunnelid: extLink['tunnel-id'],
                                    from: extLink['left-node-id'],
                                    to: extLink['right-node-id'],
                                    color: linkColor,
                                    title: title,
                                    sd: extLink['left-node-id'] + extLink['right-node-id'],
                                    lspid: extLink['lsp-id']
                                };

                                aEdges.push(visLink);
                                linksMap[visLink.from + ":" + visLink.to] = visLink.id;
                            }
                        });
                    }

                    //删除外部节点与外部节点之间的link
                    var closeEdge = [];
                    angular.forEach(aEdges, function(edge, index) {
                        var fromIndex = aExtNodes.indexOf(edge.from);
                        var toIndex = aExtNodes.indexOf(edge.to);
                        var fromElineIndex = aElineExtNode.indexOf(edge.from);
                        var toElineIndex = aElineExtNode.indexOf(edge.to);

                        if (fromIndex !== -1 && toIndex !== -1) {
                            if (fromElineIndex !== -1 || toElineIndex !== -1) {
                                closeEdge.push(edge);
                            }
                        } else {
                            closeEdge.push(edge);
                        }
                    });

                    //原始数据保存
                    var initData = {
                        nodes: aNodes,
                        edges: closeEdge
                    };
                    var openInitData = {};
                    $.extend(true, openInitData, initData);

                    //判断link的from或to的节点是否为画云的节点
                    angular.forEach(closeEdge, function(edge, index) {
                        var IsExtNodeFrom = aExtNodes.indexOf(edge.from);
                        var IsExtNodeTo = aExtNodes.indexOf(edge.to);
                        var fromIndex = aElineExtNode.indexOf(edge.from);
                        var toIndex = aElineExtNode.indexOf(edge.to);

                        if (IsExtNodeFrom !== -1) {
                            if (fromIndex !== -1) {
                                aNoCloudNode.push(edge.from);
                            } else {
                                var topoId = '';
                                angular.forEach(aNodes, function(node, index) {
                                    if (node.id === edge.from) {
                                        topoId = node.topoId;
                                    }
                                });

                                var flag = false;
                                angular.forEach(aYesCloudNode, function(node, index) {
                                    if (node.id == edge.from) {
                                        flag = true;
                                        return;
                                    }

                                });

                                if (!flag) {
                                    aYesCloudNode.push({
                                        id: edge.from,
                                        topoId: topoId
                                    });
                                }
                            }
                        }

                        if (IsExtNodeTo !== -1) {
                            if (toIndex !== -1) {
                                aNoCloudNode.push(edge.to);
                            } else {
                                var topoIdTo = '';
                                angular.forEach(aNodes, function(node, index) {
                                    if (node.id === edge.to) {
                                        topoIdTo = node.topoId;
                                    }
                                });
                                var flagTo = false;
                                angular.forEach(aYesCloudNode, function(node, index) {
                                    if (node.id == edge.to) {
                                        flagTo = true;
                                        return;
                                    }

                                });

                                if (!flagTo) {
                                    aYesCloudNode.push({
                                        id: edge.to,
                                        topoId: topoIdTo
                                    });
                                }
                            }
                        }
                    });

                    //组合不同拓扑id下的外部节点
                    var aYesCloudTopologyId = {};
                    angular.forEach(aYesCloudNode, function(node, index) {
                        if (!aYesCloudTopologyId.hasOwnProperty(node.topoId)) {
                            aYesCloudTopologyId[node.topoId] = [node];
                        } else {
                            aYesCloudTopologyId[node.topoId].push(node);
                        }
                    });

                    //绘制多个云
                    var aCloseNodes = [];
                    for (var name in aYesCloudTopologyId) {
                        //删除画云的外部节点

                        var nodes = aYesCloudTopologyId[name];
                        var newVisNodes = svc.deleteExtCloudNodes(nodes, aNodes);

                        aNodes.length = 0;
                        $.extend(true, aNodes, newVisNodes);

                        /*for (var i = 0; i < nodes.length; i++) {
                            for (var n = 0; n < aNodes.length; n++) {
                                if (nodes[i].id == aNodes[n].id) {
                                    aNodes.splice(n, 1);
                                }
                            }
                        }*/

                        var cloudNode = {
                            id: 'cloudNodeId' + '$%@*^#' + name,
                            label: 'Cloud:' + name,
                            size: 45,
                            topoId: name,
                            group: 'cloud'
                                //title: 'Cloud'
                        };
                        aNodes.push(cloudNode);


                        //link中存在画云的节点换成云节点
                        for (var m = 0; m < nodes.length; m++) {
                            for (var j = 0; j < closeEdge.length; j++) {
                                if (closeEdge[j].from == nodes[m].id) {
                                    closeEdge[j].from = cloudNode.id;
                                }

                                if (closeEdge[j].to == nodes[m].id) {
                                    closeEdge[j].to = cloudNode.id;
                                }

                                if (closeEdge[j].to.indexOf('cloudNodeId$%@*^#') !== -1 || closeEdge[j].from.indexOf('cloudNodeId$%@*^#') !== -1) {
                                    closeEdge[j].color = 'blue';
                                    closeEdge[j].backtitle = closeEdge[j].title;
                                    delete closeEdge[j].title;
                                }

                                closeEdge[j].sd = closeEdge[j].from + closeEdge[j].to;

                            }
                        }
                    }

                    //repeat
                    var newACloseEdges = svc.deleteRepeatEdges(closeEdge);

                    var visData = {
                        nodes: aNodes,
                        edges: newACloseEdges
                    };
                    cb(visData, openInitData, aYesCloudTopologyId);

                }
            }

            //formatLspData(data, cb);
            return svc.base().post('topo-cloud:get-lsp-by-pw', {
                input: {
                    'eline-id': tunnel.elineid,
                    'pw-id': tunnel.pwid
                }
            }).then(function(data) {
                formatLspData(data, cb);
            });
        };

        return svc;
    }]);

    topology.register.factory('ManagerTopologySvc', ['$filter', 'TopologyRestangular', function($filter, TopologyRestangular) {
        var svc = {
            base: function() {
                return TopologyRestangular.one('restconf').one('operations').one('sptn-net-topology:get-manager-topology');
            }
        };

        //处理显示的字段值为undefined的显示为空字符串
        svc.handleUndefined = function(sData) {
            return ((sData === undefined || sData === null) ? '' : sData);
        };

        //检查node是否存在
        svc.checkNodeExist = function(aNodes, sNodeId) {
            angular.forEach(aNodes, function(node) {
                if (node.id === sNodeId) {
                    return true;
                }
            });

            return false;
        };

        //检查链路是否存在    
        svc.checkEdgeExist = function(aEdges, edge) {
            for (var i = 0; i < aEdges.length; i++) {
                var a = aEdges[i].from + aEdges[i].fromport + aEdges[i].to + aEdges[i].toport;
                var b = edge.from + edge.fromport + edge.to + edge.toport;
                var c = edge.to + edge.toport + edge.from + edge.fromport;

                if (a == b || a == c) {
                    return true;
                }
            }

            return false;
        };

        //get icon sdn node
        svc.getAllIconNodes = function(cb) {
            $.ajax({
                url: TopologyRestangular.configuration.baseUrl + "/restconf/operations/sptn-net-topology:get-all-linktopo-info",
                contentType: "application/json",
                type: 'post',
                async: false,
                dataType: "json",
                data: JSON.stringify({ input: {} }),
                success: function(data) {
                    if (data && data['output']) {
                        var nodeList = data['output'];
                        cb(nodeList);
                    }
                },
                failure: function(response) {
                    console.log($filter('translate')('Error with status code:') + response.status);
                }
            });
        };

        svc.getManagerExtNodes = function(cb) {
            $.ajax({
                type: "get",
                url: TopologyRestangular.configuration.baseUrl + "/restconf/operational/sptn-net-topology:net-topology/ext-nodes",
                async: false,
                success: function(response) {
                    if (response && response["ext-nodes"]) {
                        var extNodeList = response["ext-nodes"]["ext-node"];
                        if (extNodeList) {
                            cb(extNodeList);
                        }
                    } else {
                        console.log("the period no data!");
                    }
                },
                error: function() {
                    console.log("get manager ext nodes failure!");
                }

            });
        };

        //获取初始的原始数据组合成vis的数据格式
        svc.getInitData = function(type, cb) {
            var bIsShow = true; //是否展示tab标签

            function formatVisInitData(data) {
                if (data.node) {
                    if (data.node.length === 0) {
                        bIsShow = false;
                        cb({ bIsShow: bIsShow });
                        return;
                    }
                } else {
                    bIsShow = false;
                    cb({ bIsShow: bIsShow });
                    return;
                }

                var nodes = data.node;
                //svc.getAllIconNodes(function(data){
                //    nodes = data.nodes;
                //});

                var links = data.link;
                var extLinks = data['ext-link'];

                var aInitNodes = [];
                var aInitEdges = [];

                var aSdnNodeIds = [];
                var aExtNodesTopo = [];

                var oCloudNodes = {};

                //get ext nodes
                var extNodes = [];
                var aExtNodeIds = [];
                var aExtNodeBuf = [];
                var aVisExtNodeIds = [];
                svc.getManagerExtNodes(function(data) {
                    $.extend(true, extNodes, data);
                });

                //node的vis的数据组合
                if (nodes && nodes !== undefined) {
                    angular.forEach(nodes, function(node) {
                        if (node.id.indexOf('openflow') >= 0) {
                            var group = '';
                            var title = '';
                            var status = svc.handleUndefined(node['operate-status']);
                            var userlabel = svc.handleUndefined(node['user-label']);
                            var name = svc.handleUndefined(node['name']);
                            var img;

                            if (status == 'operate-up') {
                                img = 'node-up';
                            } else {
                                img = 'node-down';
                            }

                            title += $filter('translate')('M_Node Id') + ':  ' + svc.handleUndefined(name) + '<br>';
                            title += $filter('translate')('M_UserLabel') + ':  ' + userlabel + '<br>';
                            title += $filter('translate')('M_Node_Status') + ':  ' + $filter('translate')(status) + '<br>';

                            var oNode = {
                                id: svc.handleUndefined(node.id),
                                label: (type == 'name') ? name : userlabel,
                                //group: group,
                                userlabel: userlabel,
                                title: title,
                                size: 20,
                                image: 'assets/images/' + img + '.png',
                                shape: 'image'
                            };

                            if (!svc.checkNodeExist(aInitNodes, oNode.id)) {
                                aInitNodes.push(oNode);
                            }

                            if (aSdnNodeIds.indexOf(oNode.id) === -1) {
                                aSdnNodeIds.push(oNode.id);
                            }
                        }
                    });
                }

                //外部node的vis的数据组合
                if (extNodes && extNodes !== undefined) {
                    angular.forEach(extNodes, function(node) {
                        var group = '';
                        var title = '';
                        var status = svc.handleUndefined(node['operate-status']);
                        var userlabel = svc.handleUndefined(node['user-label']);
                        var topoid = svc.handleUndefined(node['parent-topo-id']);
                        var resourceId = svc.handleUndefined(node['resource-id']);
                        var nodeIP = svc.handleUndefined(node['ip']);
                        var name = svc.handleUndefined(node['name']);

                        if (status == 'operate-up') {
                            group = 'ext-up';
                        } else {
                            group = 'ext-down';
                        }

                        title += $filter('translate')('M_Node Id') + ':  ' + svc.handleUndefined(name) + '<br>';
                        title += $filter('translate')('M_UserLabel') + ':  ' + userlabel + '<br>';
                        title += $filter('translate')('M_Resource_Id') + ':  ' + resourceId + '<br>';
                        title += $filter('translate')('M_IP') + ':  ' + nodeIP + '<br>';
                        title += $filter('translate')('M_Parent_Topo_Id') + ':  ' + topoid + '<br>';
                        //title += $filter('translate')('operate-status') + ':  <font color="#fff">' + $filter('translate')(status) + '</font><br>';

                        var oNode = {
                            id: svc.handleUndefined(node.id),
                            label: (type == 'name') ? name : userlabel,
                            group: group,
                            userlabel: userlabel,
                            title: title,
                            topoid: topoid,
                            size: 20
                        };

                        if (!svc.checkNodeExist(aExtNodeBuf, oNode.id)) {
                            aExtNodeBuf.push(oNode);
                        }

                        /*if(!svc.checkNodeExist(aExtNodesTopo, oNode.id)){
                            aExtNodesTopo.push({
                                id: oNode.id,
                                topoid : oNode.topoid
                            });
                        }*/

                        if (!svc.checkNodeExist(aExtNodeIds, oNode.id)) {
                            aExtNodeIds.push(oNode.id);
                        }
                    });
                }

                //link的vis的数据组合
                if (links && links !== undefined) {
                    angular.forEach(links, function(link, index) {
                        var linkColor = '';
                        var title = '';
                        var LeftNodeId = svc.handleUndefined(link['left-node-id']);
                        var rightNodeId = svc.handleUndefined(link['right-node-id']);
                        var leftLtpId = svc.handleUndefined(link['left-ltp-id']);
                        var rightLtpId = svc.handleUndefined(link['right-ltp-id']);
                        var status = svc.handleUndefined(link['operate-status']);
                        var managerStatus = svc.handleUndefined(link['manager-vlan-status']);

                        if (managerStatus == 'out') {
                            linkColor = 'gray';
                        } else {
                            if (status == 'operate-up') {
                                linkColor = 'green';
                            } else {
                                linkColor = 'red';
                            }
                        }

                        var leftNodeUserlabel = svc.handleUndefined(link['left-node-user-label']);
                        var rightNodeUserLabel = svc.handleUndefined(link['right-node-user-label']);
                        var leftLtpUserLabel = svc.handleUndefined(link['left-ltp-user-label']);
                        var rightLtpUserlabel = svc.handleUndefined(link['right-ltp-user-label']);

                        var leftNodeName = svc.handleUndefined(link['left-node-name']);
                        var rightNodeName = svc.handleUndefined(link['right-node-name']);
                        var leftLtpName = svc.handleUndefined(link['left-ltp-name']);
                        var rightLtpName = svc.handleUndefined(link['right-ltp-name']);

                        var leftNode;
                        var rightNode;
                        var leftLtp;
                        var rightLtp;

                        if (type == 'name') {
                            leftNode = leftNodeName;
                            rightNode = rightNodeName;
                            leftLtp = leftLtpName;
                            rightLtp = rightLtpName;
                        } else {
                            leftNode = leftNodeUserlabel;
                            rightNode = rightNodeUserLabel;
                            leftLtp = leftLtpUserLabel;
                            rightLtp = rightLtpUserlabel;
                        }

                        title += $filter('translate')('M_Left_Node') + ':  ' + leftNode + '<br>';
                        title += $filter('translate')('M_Right_Node') + ':  ' + rightNode + '<br>';
                        title += $filter('translate')('M_Left_Port') + ':  ' + leftLtp + '<br>';
                        title += $filter('translate')('M_Right_Port') + ':  ' + rightLtp + '<br>';
                        title += $filter('translate')('M_Manager_Status') + ':  ' + $filter('translate')(managerStatus) + '<br>';
                        title += $filter('translate')('M_Node_Status') + ':  ' + $filter('translate')(status);

                        var oLink = {
                            id: link.id,
                            from: LeftNodeId,
                            to: rightNodeId,
                            fromport: leftLtpId,
                            toport: rightLtpId,
                            color: linkColor,
                            title: title
                        };

                        if (LeftNodeId.indexOf('openflow') >= 0 && rightNodeId.indexOf('openflow') >= 0) {
                            if (!svc.checkEdgeExist(aInitEdges, oLink)) {
                                aInitEdges.push(oLink);
                            }
                        }
                    });
                }

                //外部link的vis的数据组合
                if (extLinks && extLinks !== undefined) {
                    angular.forEach(extLinks, function(link) {
                        var linkColor = '';
                        var title = '';
                        var LeftNodeId = svc.handleUndefined(link['left-node-id']);
                        var rightNodeId = svc.handleUndefined(link['right-node-id']);
                        var leftLtpId = svc.handleUndefined(link['left-ltp-id']);
                        var rightLtpId = svc.handleUndefined(link['right-ltp-id']);
                        var status = svc.handleUndefined(link['operate-status']);
                        var leftMac = svc.handleUndefined(link['left-ltp-mac']);
                        var rightMac = svc.handleUndefined(link['right-ltp-mac']);

                        if (status == 'operate-up') {
                            linkColor = 'green';
                        } else {
                            linkColor = 'red';
                        }

                        var leftNodeUserlabel = svc.handleUndefined(link['left-node-user-label']);
                        var rightNodeUserLabel = svc.handleUndefined(link['right-node-user-label']);
                        var leftLtpUserLabel = svc.handleUndefined(link['left-ltp-user-label']);
                        var rightLtpUserlabel = svc.handleUndefined(link['right-ltp-user-label']);

                        var leftNodeName = svc.handleUndefined(link['left-node-name']);
                        var rightNodeName = svc.handleUndefined(link['right-node-name']);
                        var leftLtpName = svc.handleUndefined(link['left-ltp-name']);
                        var rightLtpName = svc.handleUndefined(link['right-ltp-name']);

                        var leftNode;
                        var rightNode;
                        var leftLtp;
                        var rightLtp;

                        if (type == 'name') {
                            leftNode = leftNodeName;
                            rightNode = rightNodeName;
                            leftLtp = leftLtpName;
                            rightLtp = rightLtpName;
                        } else {
                            leftNode = leftNodeUserlabel;
                            rightNode = rightNodeUserLabel;
                            leftLtp = leftLtpUserLabel;
                            rightLtp = rightLtpUserlabel;
                        }

                        title += $filter('translate')('M_Left_Node') + ':  ' + leftNode + '<br>';
                        title += $filter('translate')('M_Right_Node') + ':  ' + rightNode + '<br>';
                        title += $filter('translate')('M_Left_Port') + ':  ' + leftLtp + '<br>';
                        title += $filter('translate')('M_Right_Port') + ':  ' + rightLtp + '<br>';
                        title += $filter('translate')('M_Left_MAC') + ':  ' + leftMac + '<br>';
                        title += $filter('translate')('M_Right_MAC') + ':  ' + rightMac + '<br>';
                        title += $filter('translate')('M_Node_Status') + ':  ' + $filter('translate')(status);

                        var oLink = {
                            id: link.id,
                            from: LeftNodeId,
                            to: rightNodeId,
                            fromport: leftLtpId,
                            toport: rightLtpId,
                            color: linkColor,
                            title: title
                        };

                        if (!svc.checkEdgeExist(aInitEdges, oLink)) {
                            var fromSdnIndex = aSdnNodeIds.indexOf(oLink.from);
                            var toSdnIndex = aSdnNodeIds.indexOf(oLink.to);
                            var fromExtNodes = aExtNodeIds.indexOf(oLink.from);
                            var toExtNodes = aExtNodeIds.indexOf(oLink.to);

                            if (fromSdnIndex === -1 && toSdnIndex !== -1) {
                                if (fromExtNodes !== -1) {
                                    if (!svc.checkNodeExist(aVisExtNodeIds, oLink.from)) {
                                        aVisExtNodeIds.push(oLink.from);
                                    }

                                    aInitEdges.push(oLink);
                                }
                            }

                            if (toSdnIndex === -1 && fromSdnIndex !== -1) {
                                if (toExtNodes !== -1) {
                                    if (!svc.checkNodeExist(aVisExtNodeIds, oLink.to)) {
                                        aVisExtNodeIds.push(oLink.to);
                                    }

                                    aInitEdges.push(oLink);
                                }
                            }

                            if ((toSdnIndex === -1 && fromSdnIndex === -1)) {
                                if (toExtNodes !== -1 && fromExtNodes !== -1) {
                                    if (!svc.checkNodeExist(aVisExtNodeIds, oLink.to)) {
                                        aVisExtNodeIds.push(oLink.to);
                                    }

                                    if (!svc.checkNodeExist(aVisExtNodeIds, oLink.from)) {
                                        aVisExtNodeIds.push(oLink.from);
                                    }
                                }
                            }
                        }
                    });
                }

                //handle ext nodes
                if (aExtNodeBuf) {
                    angular.forEach(aExtNodeBuf, function(node) {
                        if (aVisExtNodeIds.indexOf(node.id) !== -1) {
                            if (!svc.checkNodeExist(aInitNodes, node.id)) {
                                aInitNodes.push(node);
                            }

                            if (!svc.checkNodeExist(aExtNodesTopo, node.id)) {
                                aExtNodesTopo.push({
                                    id: node.id,
                                    topoid: node.topoid
                                });
                            }
                        }
                    });
                }

                //组合要画云的外部节点
                angular.forEach(aExtNodesTopo, function(node) {
                    if (oCloudNodes.hasOwnProperty(node.topoid)) {
                        oCloudNodes[node.topoid].push(node.id);
                    } else {
                        oCloudNodes[node.topoid] = [node.id];
                    }
                });

                var cbData = {
                    nodes: aInitNodes,
                    edges: aInitEdges,
                    cloudExtNodes: oCloudNodes,
                    bIsShow: bIsShow
                };

                cb(cbData);
            }

            /*formatVisInitData(data);*/

            $.ajax({
                url: TopologyRestangular.configuration.baseUrl + "/restconf/operations/sptn-net-topology:get-manager-topology",
                contentType: "application/json",
                type: 'post',
                async: false,
                dataType: "json",
                success: function(response) {
                    var resultList = response.output;
                    if (resultList === undefined) {
                        console.log("The period you select has no data!");
                    } else {
                        formatVisInitData(resultList);
                    }
                },
                error: function() {
                    console.log('get manager data error!');
                }
            });
        };

        //删除要画云的node
        svc.deleteExtCloudNodes = function(sArr, dArr) {
            var flag = true;
            var arr = [];
            for (var aa = 0; aa < dArr.length; aa++) {
                for (var bb = 0; bb < sArr.length; bb++) {
                    if (dArr[aa].id == sArr[bb]) {
                        flag = false;
                        break;
                    }
                }

                if (flag) {
                    arr.push(dArr[aa]);
                }

                flag = true;
            }

            return arr;
        };

        //组合要闭合云的vis数据
        svc.closeCloud = function(aCloudExtNodes, oCloudNode, aInitEdges, aInitNodes) {
            var aNewNodes = [];
            var aNewEdges = [];

            $.extend(true, aNewNodes, aInitNodes);
            $.extend(true, aNewEdges, aInitEdges);

            aNewNodes.push(oCloudNode);

            angular.forEach(aCloudExtNodes, function(cloudNode, index) {
                angular.forEach(aNewEdges, function(link) {
                    if (link.from == cloudNode) {
                        link.from = oCloudNode.id;
                        link.color = 'blue';
                        delete link.title;
                    }

                    if (link.to == cloudNode) {
                        link.to = oCloudNode.id;
                        link.color = 'blue';
                        delete link.title;
                    }
                });
            });

            var nodesnew = svc.deleteExtCloudNodes(aCloudExtNodes, aNewNodes);
            var visData = {
                nodes: nodesnew,
                edges: aNewEdges
            };

            return visData;
        };

        //展开云的数据
        svc.openCloud = function(aCloudExtNodes, oCloudNode, aInitEdges, aInitNodes) {
            var aNewNodes = [];
            var aNewEdges = [];

            $.extend(true, aNewNodes, aInitNodes);
            $.extend(true, aNewEdges, aInitEdges);

            aNewNodes.push(oCloudNode);
            angular.forEach(aCloudExtNodes, function(cloudNode) {
                var oCloudLink = {
                    id: 'CloudLinkId' + '-' + oCloudNode.id + '-' + cloudNode,
                    from: cloudNode,
                    to: oCloudNode.id,
                    color: 'gray',
                    dashes: true
                };
                aNewEdges.push(oCloudLink);
            });

            var visData = {
                nodes: aNewNodes,
                edges: aNewEdges
            };

            return visData;
        };

        //初始化画云的数据
        svc.initCloudData = function(data, status, cb) {
            if (data) {
                if (!data.bIsShow) {
                    return;
                }

                var nodes = data.nodes;
                var edges = data.edges;
                var cloudExtNodesIds = data.cloudExtNodes;

                if (cloudExtNodesIds) {
                    for (var name in cloudExtNodesIds) {
                        var extNodes = cloudExtNodesIds[name];
                        var cloudNode = {
                            id: 'CloudNodeId' + '-' + name,
                            group: 'cloud',
                            label: 'Cloud:' + name,
                            size: 45
                        };

                        var funCloud = (status[name]) ? svc.openCloud : svc.closeCloud;
                        var oData = funCloud(extNodes, cloudNode, edges, nodes);
                        nodes.length = 0;
                        edges.length = 0;
                        $.extend(true, nodes, oData.nodes);
                        $.extend(true, edges, oData.edges);
                    }

                    var visData = {
                        nodes: nodes,
                        edges: edges
                    };

                    cb(visData);
                }

            }
        };
        return svc;
    }]);


    topology.register.factory('FlowMonitorTopologySvc', ['$filter', 'TopologyRestangular', function($filter, TopologyRestangular) {
        var svc = {};

        //处理显示的字段值为undefined的显示为空字符串
        svc.handleUndefined = function(sData) {
            return ((sData === undefined || sData === null) ? '' : sData);
        };

        //检查node是否存在
        svc.checkNodeExist = function(aNodes, sNodeId) {

            for (var i = 0; i < aNodes.length; i++) {
                if (aNodes[i].id == sNodeId) {
                    return true;
                }
            }

            return false;
        };

        //get icon sdn node
        svc.getAllIconNodes = function(cb) {
            $.ajax({
                url: TopologyRestangular.configuration.baseUrl + "/restconf/operations/sptn-net-topology:get-all-linktopo-info",
                contentType: "application/json",
                type: 'post',
                async: false,
                dataType: "json",
                data: JSON.stringify({ input: {} }),
                success: function(data) {
                    if (data && data['output']) {
                        var nodeList = data['output'];
                        cb(nodeList);
                    }
                },
                failure: function(response) {
                    console.log($filter('translate')('Error with status code:') + response.status);
                }
            });
        };

        svc.getAllLinks = function(cb) {
            $.ajax({
                url: TopologyRestangular.configuration.baseUrl + "/restconf/operations/sptn-net-topology:get-all-links-info",
                contentType: "application/json",
                type: 'post',
                async: false,
                dataType: "json",
                data: JSON.stringify({ input: {} }),
                success: function(data) {
                    if (data && data['output']) {
                        var nodeList = data['output'];
                        cb(nodeList);
                    }
                },
                failure: function(response) {
                    console.log($filter('translate')('Error with status code:') + response.status);
                }
            });
        };

        //检查链路是否存在
        svc.checkEdgeExist = function(aEdges, edge) {
            for (var i = 0; i < aEdges.length; i++) {
                var a = aEdges[i].from + aEdges[i].fromport + aEdges[i].to + aEdges[i].toport;
                var b = edge.from + edge.fromport + edge.to + edge.toport;

                if (a == b) {
                    return true;
                }
            }

            return false;
        };

        //获取指定节点的坐标
        svc.getNodeCoordinate = function(id, type, cb) {
            var sUrl = '';

            if (type == 'sdn') {
                sUrl = '/restconf/operations/sptn-net-topology:get-node-coordinate-by-id';
            } else {
                sUrl = '/restconf/operations/sptn-net-topology:get-ext-node-coordinate-by-id';
            }

            $.ajax({
                url: TopologyRestangular.configuration.baseUrl + sUrl,
                contentType: "application/json",
                type: 'post',
                async: false,
                dataType: "json",
                data: JSON.stringify({ 'input': { 'node-id': id } }),
                success: function(response) {
                    if (response) {
                        var resultList = response['output'];
                        if (resultList === undefined) {
                            console.log("The period you select has no data!");
                        } else {
                            cb(resultList);
                        }
                    }
                },
                error: function() {
                    console.log('get node topo x and y  data error!');
                }
            });
        };
        //获取初始的原始数据组合成vis的数据格式
        svc.getInitData = function(type, cb) {
            function formatVisInitData(data) {
                var nodes = [];
                var links = [];
                var extNodes = [];
                var extLinks = [];

                svc.getAllIconNodes(function(data) {
                    if (data.nodes) {
                        $.extend(true, nodes, data.nodes);
                    }
                });

                // if(data.links){
                //     $.extend(true, links, data.links.link);
                // }

                svc.getAllLinks(function(data) {
                    if (data.link) {
                        $.extend(true, links, data.link);
                    }
                });

                if (data['ext-nodes']) {
                    $.extend(true, extNodes, data['ext-nodes']['ext-node']);
                }

                if (data['ext-links']) {
                    $.extend(true, extLinks, data['ext-links']['ext-link']);
                }

                var aInitNodes = [];
                var aInitEdges = [];

                var aSdnNodeIds = [];
                var aExtNodesTopo = [];
                var aExtNodeIds = [];

                var oCloudNodes = {};

                //node的vis的数据组合
                if (nodes && nodes !== undefined) {
                    angular.forEach(nodes, function(node) {
                        if (node.id.indexOf('openflow') >= 0) {
                            var group = '';
                            var title = '';
                            var status = svc.handleUndefined(node['operate-status']);
                            var userlabel = svc.handleUndefined(node['user-label']);

                            var nodeType = svc.handleUndefined(node['node-type']);
                            var latency = svc.handleUndefined(node['latency']);
                            var nodeName = svc.handleUndefined(node['name']);
                            var parentTopoId = svc.handleUndefined(node['parent-topo-id']);
                            var adminStatus = svc.handleUndefined(node['admin-status']);

                            if (status == 'operate-up') {
                                group = 'sdn-up';
                            } else {
                                group = 'sdn-down';
                            }

                            title += $filter('translate')('M_Node Id') + ': ' + nodeName + '<br>';
                            title += $filter('translate')('M_UserLabel') + ': ' + userlabel + '<br>';
                            title += $filter('translate')('M_Node_Status') + ':  ' + $filter('translate')(status) + '<br>';

                            var oNode = {
                                id: svc.handleUndefined(node.id),
                                label: (type == 'name') ? nodeName : userlabel,
                                group: group,
                                userlabel: userlabel,
                                nodetype: nodeType,
                                title: title,
                                status: status,
                                image: 'assets/images/' + node['icon'] + '.png',
                                shape: 'image',
                                size: 20
                            };

                            svc.getNodeCoordinate(node.id, 'sdn', function(data) {
                                if (data) {
                                    oNode.x = data.x;
                                    oNode.y = data.y;
                                }
                            });

                            if (!svc.checkNodeExist(aInitNodes, oNode.id)) {
                                aInitNodes.push(oNode);
                            }

                            if (aSdnNodeIds.indexOf(oNode.id) === -1) {
                                aSdnNodeIds.push(oNode.id);
                            }
                        }
                    });
                }

                //外部node的vis的数据组合
                if (extNodes && extNodes !== undefined) {
                    angular.forEach(extNodes, function(node) {
                        var group = '';
                        var title = '';
                        var status = svc.handleUndefined(node['operate-status']);
                        var userlabel = svc.handleUndefined(node['user-label']);
                        var topoid = svc.handleUndefined(node['parent-topo-id']);
                        var resourceId = svc.handleUndefined(node['resource-id']);
                        var nodeIP = svc.handleUndefined(node['ip']);

                        var adminStatus = svc.handleUndefined(node['admin-status']);
                        var nodeName = svc.handleUndefined(node['name']);
                        var nodeType = svc.handleUndefined(node['node-type']);

                        if (status == 'operate-up') {
                            group = 'ext-up';
                        } else {
                            group = 'ext-down';
                        }

                        title += $filter('translate')('M_Node Id') + ':  ' + nodeName + '<br>';
                        title += $filter('translate')('M_UserLabel') + ':  ' + userlabel + '<br>';
                        title += $filter('translate')('M_Resource_Id') + ':  ' + resourceId + '<br>';
                        title += $filter('translate')('M_IP') + ':  ' + nodeIP + '<br>';
                        title += $filter('translate')('M_Parent_Topo_Id') + ':  ' + topoid + '<br>';
                        //title += $filter('translate')('operate-status') + ':  <font color="#fff">' + $filter('translate')(status) + '</font><br>';

                        var oNode = {
                            id: svc.handleUndefined(node.id),
                            label: (type == 'name') ? nodeName : userlabel,
                            resourceid: resourceId,
                            ip: nodeIP,
                            status: status,
                            group: group,
                            userlabel: userlabel,
                            title: title,
                            topoid: topoid,
                            size: 20
                        };

                        svc.getNodeCoordinate(node.id, 'ext', function(data) {
                            if (data) {
                                oNode.x = data.x;
                                oNode.y = data.y;
                            }
                        });

                        if (!svc.checkNodeExist(aExtNodesTopo, oNode.id)) {
                            aExtNodesTopo.push({
                                id: oNode.id,
                                topoid: oNode.topoid
                            });
                        }

                        if (!svc.checkNodeExist(aInitNodes, oNode.id)) {
                            aInitNodes.push(oNode);
                        }

                    });
                }

                //link的vis的数据组合
                if (links && links !== undefined) {
                    angular.forEach(links, function(link, index) {
                        var linkColor = 'gray';
                        var title = '';
                        var LeftNodeId = svc.handleUndefined(link['left-node-id']);
                        var rightNodeId = svc.handleUndefined(link['right-node-id']);
                        var leftLtpId = svc.handleUndefined(link['left-ltp-id']);
                        var rightLtpId = svc.handleUndefined(link['right-ltp-id']);
                        // var status = svc.handleUndefined(link['operate-status']);

                        var teAttrRun = svc.handleUndefined(link['link-te-attr-run']);
                        var rate;

                        if (teAttrRun) {
                            var useBandWidth = parseInt(teAttrRun['physical-bandwidth']);
                            var unuseBandWidth = parseInt(teAttrRun['available-bandwidth']);

                            rate = Math.floor(useBandWidth / (useBandWidth + unuseBandWidth) * 100) / 100;

                            if (rate >= 0.8) {
                                linkColor = 'red';
                            } else if (rate >= 0.6) {
                                linkColor = 'orange';
                            } else {
                                linkColor = 'green';
                            }
                        }

                        var leftNodeUserlabel = svc.handleUndefined(link['left-node-user-label']);
                        var rightNodeUserLabel = svc.handleUndefined(link['right-node-user-label']);
                        var leftLtpUserLabel = svc.handleUndefined(link['left-ltp-user-label']);
                        var rightLtpUserlabel = svc.handleUndefined(link['right-ltp-user-label']);

                        var leftNodeName = svc.handleUndefined(link['left-node-name']);
                        var rightNodeName = svc.handleUndefined(link['right-node-name']);
                        var leftLtpName = svc.handleUndefined(link['left-ltp-name']);
                        var rightLtpName = svc.handleUndefined(link['right-ltp-name']);

                        var leftNode;
                        var rightNode;
                        var leftLtp;
                        var rightLtp;

                        if (type == 'name') {
                            leftNode = leftNodeName;
                            rightNode = rightNodeName;
                            leftLtp = leftLtpName;
                            rightLtp = rightLtpName;
                        } else {
                            leftNode = leftNodeUserlabel;
                            rightNode = rightNodeUserLabel;
                            leftLtp = leftLtpUserLabel;
                            rightLtp = rightLtpUserlabel;
                        }

                        title += $filter('translate')('M_Left_Node') + ':  ' + leftNode + '<br>';
                        title += $filter('translate')('M_Right_Node') + ':  ' + rightNode + '<br>';
                        title += $filter('translate')('M_Left_Port') + ':  ' + leftLtp + '<br>';
                        title += $filter('translate')('M_Right_Port') + ':  ' + rightLtp + '<br>';
                        //title += $filter('translate')('M_Flow_Status') + ':  <font color="#fff">' + $filter('translate')(status) + '</font>';

                        var leftUserLabel = '';
                        var rightUserLabel = '';

                        angular.forEach(aInitNodes, function(node) {
                            if (node.id == LeftNodeId) {
                                leftUserLabel = node.userlabel;
                            }

                            if (node.id == rightNodeId) {
                                rightUserLabel = node.userlabel;
                            }
                        });
                        leftLtpId = svc.handleUndefined(leftLtpId.split(':')[2]);
                        rightLtpId = svc.handleUndefined(rightLtpId.split(':')[2]);

                        var oLink = {
                            id: link.id,
                            linkname: leftUserLabel + ':' + leftLtpUserLabel + '-->' + rightUserLabel + ':' + rightLtpUserlabel,
                            rate: rate,
                            from: LeftNodeId,
                            to: rightNodeId,
                            fromport: leftLtpId,
                            toport: rightLtpId,
                            color: linkColor,
                            arrows: { middle: { scaleFactor: 0.5 } },
                            title: title
                        };

                        if (LeftNodeId.indexOf('openflow') >= 0 && rightNodeId.indexOf('openflow') >= 0) {
                            if (!svc.checkEdgeExist(aInitEdges, oLink)) {
                                aInitEdges.push(oLink);
                            }
                        }
                    });
                }

                //外部link的vis的数据组合
                if (extLinks && extLinks !== undefined) {
                    angular.forEach(extLinks, function(link) {
                        var linkColor = 'gray';
                        var title = '';
                        var LeftNodeId = svc.handleUndefined(link['left-node-id']);
                        var rightNodeId = svc.handleUndefined(link['right-node-id']);
                        var leftLtpId = svc.handleUndefined(link['left-ltp-id']);
                        var rightLtpId = svc.handleUndefined(link['right-ltp-id']);
                        //var status = svc.handleUndefined(link['operate-status']);
                        var leftMac = svc.handleUndefined(link['left-ltp-mac']);
                        var rightMac = svc.handleUndefined(link['right-ltp-mac']);

                        var teAttrRun = svc.handleUndefined(link['link-te-attr-run']);
                        var rate;

                        if (teAttrRun) {
                            var useBandWidth = parseInt(teAttrRun['physical-bandwidth']);
                            var unuseBandWidth = parseInt(teAttrRun['available-bandwidth']);

                            rate = Math.floor(useBandWidth / (useBandWidth + unuseBandWidth) * 100) / 100;

                            if (rate >= 0.8) {
                                linkColor = 'red';
                            } else if (rate >= 0.6) {
                                linkColor = 'orange';
                            } else {
                                linkColor = 'green';
                            }
                        }

                        var leftNodeUserlabel = svc.handleUndefined(link['left-node-user-label']);
                        var rightNodeUserLabel = svc.handleUndefined(link['right-node-user-label']);
                        var leftLtpUserLabel = svc.handleUndefined(link['left-ltp-user-label']);
                        var rightLtpUserlabel = svc.handleUndefined(link['right-ltp-user-label']);

                        var leftNodeName = svc.handleUndefined(link['left-node-name']);
                        var rightNodeName = svc.handleUndefined(link['right-node-name']);
                        var leftLtpName = svc.handleUndefined(link['left-ltp-name']);
                        var rightLtpName = svc.handleUndefined(link['right-ltp-name']);

                        var leftNode;
                        var rightNode;
                        var leftLtp;
                        var rightLtp;

                        if (type == 'name') {
                            leftNode = leftNodeName;
                            rightNode = rightNodeName;
                            leftLtp = leftLtpName;
                            rightLtp = rightLtpName;
                        } else {
                            leftNode = leftNodeUserlabel;
                            rightNode = rightNodeUserLabel;
                            leftLtp = leftLtpUserLabel;
                            rightLtp = rightLtpUserlabel;
                        }

                        title += $filter('translate')('M_Left_Node') + ':  ' + leftNode + '<br>';
                        title += $filter('translate')('M_Right_Node') + ':  ' + rightNode + '<br>';
                        title += $filter('translate')('M_Left_Port') + ':  ' + leftLtp + '<br>';
                        title += $filter('translate')('M_Right_Port') + ':  ' + rightLtp + '<br>';
                        title += $filter('translate')('M_Left_MAC') + ':  ' + leftMac + '<br>';
                        title += $filter('translate')('M_Right_MAC') + ':  ' + rightMac + '<br>';
                        //title += $filter('translate')('M_Node_Status') + ':  <font color="#fff">' + $filter('translate')(status) + '</font>';

                        var leftUserLabel = '';
                        var rightUserLabel = '';

                        angular.forEach(aInitNodes, function(node) {
                            if (node.id == LeftNodeId) {
                                leftUserLabel = node.userlabel;
                            }

                            if (node.id == rightNodeId) {
                                rightUserLabel = node.userlabel;
                            }
                        });

                        leftLtpId = svc.handleUndefined(leftLtpId.split(':')[2]);
                        rightLtpId = svc.handleUndefined(rightLtpId.split(':')[2]);

                        var oLink = {
                            id: link.id,
                            linkname: leftUserLabel + ':' + leftLtpUserLabel + '-->' + rightUserLabel + rightLtpUserlabel,
                            rate: rate,
                            from: LeftNodeId,
                            to: rightNodeId,
                            fromport: leftLtpId,
                            toport: rightLtpId,
                            color: linkColor,
                            leftmac: leftMac,
                            arrows: { middle: { scaleFactor: 0.5 } },
                            rightmac: rightMac,
                            title: title
                        };

                        if (!svc.checkEdgeExist(aInitEdges, oLink)) {

                            var fromIndex = aSdnNodeIds.indexOf(oLink.from);
                            var toIndex = aSdnNodeIds.indexOf(oLink.to);

                            if (fromIndex !== -1 || toIndex !== -1) {
                                aInitEdges.push(oLink);
                            }
                        }
                    });
                }
                //组合要画云的外部节点
                angular.forEach(aExtNodesTopo, function(node) {
                    if (oCloudNodes.hasOwnProperty(node.topoid)) {
                        oCloudNodes[node.topoid].push(node.id);
                    } else {
                        oCloudNodes[node.topoid] = [node.id];
                    }
                });

                var cbData = {
                    nodes: aInitNodes,
                    edges: aInitEdges,
                    cloudExtNodes: oCloudNodes
                };

                cb(cbData);
            }

            /*formatVisInitData(data);*/

            $.ajax({
                url: TopologyRestangular.configuration.baseUrl + "/restconf/operational/sptn-net-topology:net-topology",
                contentType: "application/json",
                type: 'get',
                async: false,
                dataType: "json",
                success: function(response) {
                    if (response) {
                        var resultList = response['net-topology'];
                        if (resultList === undefined) {
                            console.log("The period you select has no data!");
                        } else {
                            formatVisInitData(resultList);
                        }
                    }
                },
                error: function() {
                    console.log('get flow topo  data error!');
                }
            });
        };

        //删除要画云的node
        svc.deleteExtCloudNodes = function(sArr, dArr) {
            var flag = true;
            var arr = [];
            for (var aa = 0; aa < dArr.length; aa++) {
                for (var bb = 0; bb < sArr.length; bb++) {
                    if (dArr[aa].id == sArr[bb]) {
                        flag = false;
                        break;
                    }
                }

                if (flag) {
                    arr.push(dArr[aa]);
                }

                flag = true;
            }

            return arr;
        };

        //组合要闭合云的vis数据
        svc.closeCloud = function(aCloudExtNodes, oCloudNode, aInitEdges, aInitNodes) {
            var aNewNodes = [];
            var aNewEdges = [];

            $.extend(true, aNewNodes, aInitNodes);
            $.extend(true, aNewEdges, aInitEdges);

            aNewNodes.push(oCloudNode);

            angular.forEach(aCloudExtNodes, function(cloudNode, index) {
                angular.forEach(aNewEdges, function(link) {
                    var title = '';
                    title += $filter('translate')('M_Left_Node') + ':  ' + link.from + '<br>';
                    title += $filter('translate')('M_Right_Node') + ':  ' + link.to + '<br>';
                    title += $filter('translate')('M_Left_Port') + ':  ' + link.fromport + '<br>';
                    title += $filter('translate')('M_Right_Port') + ':  ' + link.toport + '<br>';
                    title += $filter('translate')('M_Left_MAC') + ':  ' + link.leftmac + '<br>';
                    title += $filter('translate')('M_Right_MAC') + ':  ' + link.rightmac + '<br>';

                    if (link.from == cloudNode) {
                        link.from = oCloudNode.id;
                        link.title = title;
                        //link.color = 'blue';
                        //delete link.title;
                    }

                    if (link.to == cloudNode) {
                        link.to = oCloudNode.id;
                        link.title = title;
                        //link.color = 'blue';
                        //delete link.title;
                    }
                });
            });

            var nodesnew = svc.deleteExtCloudNodes(aCloudExtNodes, aNewNodes);
            var visData = {
                nodes: nodesnew,
                edges: aNewEdges
            };

            return visData;
        };

        //展开云的数据
        svc.openCloud = function(aCloudExtNodes, oCloudNode, aInitEdges, aInitNodes) {
            var aNewNodes = [];
            var aNewEdges = [];

            $.extend(true, aNewNodes, aInitNodes);
            $.extend(true, aNewEdges, aInitEdges);

            aNewNodes.push(oCloudNode);
            angular.forEach(aCloudExtNodes, function(cloudNode) {
                var oCloudLink = {
                    id: 'CloudLinkId' + '-' + oCloudNode.id + '-' + cloudNode,
                    from: cloudNode,
                    to: oCloudNode.id,
                    color: 'gray',
                    dashes: true
                };
                aNewEdges.push(oCloudLink);
            });

            var visData = {
                nodes: aNewNodes,
                edges: aNewEdges
            };

            return visData;
        };

        //初始化画云的数据
        svc.initCloudData = function(data, status, cb) {
            if (data) {
                var nodes = data.nodes;
                var edges = data.edges;
                var cloudExtNodesIds = data.cloudExtNodes;

                if (cloudExtNodesIds) {
                    for (var name in cloudExtNodesIds) {
                        var extNodes = cloudExtNodesIds[name];
                        var cloudNode = {
                            id: 'CloudNodeId' + '-' + name,
                            group: 'cloud',
                            label: 'Cloud:' + name,
                            size: 45
                        };

                        for (var ff = 0; ff < nodes.length; ff++) {
                            if (extNodes.indexOf(nodes[ff].id) !== -1) {
                                if (parseInt(nodes[ff].x) && parseInt(nodes[ff].y)) {
                                    cloudNode.x = String(parseInt(nodes[ff].x) + 60);
                                    cloudNode.y = String(parseInt(nodes[ff].y) + 60);

                                    break;
                                }
                            }
                        }

                        var funCloud = (status[name]) ? svc.openCloud : svc.closeCloud;
                        var oData = funCloud(extNodes, cloudNode, edges, nodes);
                        nodes.length = 0;
                        edges.length = 0;
                        $.extend(true, nodes, oData.nodes);
                        $.extend(true, edges, oData.edges);
                    }

                    var visData = {
                        nodes: nodes,
                        edges: edges
                    };

                    cb(visData);
                }

            }
        };

        svc.updateNodePosition = function(allNodes, cb) {
            if (allNodes) {
                var cloudPosition = {};

                for (var nodeId in allNodes) {
                    if (nodeId && allNodes[nodeId]) {

                        if (nodeId.indexOf('CloudNodeId') !== -1) {
                            cloudPosition[nodeId] = allNodes[nodeId];
                        } else {
                            $.ajax({
                                url: TopologyRestangular.configuration.baseUrl + "/restconf/operations/sptn-net-topology:update-node-coordinate",
                                contentType: "application/json",
                                type: 'post',
                                async: false,
                                dataType: "json",
                                data: JSON.stringify({
                                    'input': {
                                        'node-id': nodeId,
                                        'x': allNodes[nodeId].x,
                                        'y': allNodes[nodeId].y
                                    }
                                })
                            });

                            $.ajax({
                                url: TopologyRestangular.configuration.baseUrl + "/restconf/operations/sptn-net-topology:update-ext-node-coordinate",
                                contentType: "application/json",
                                type: 'post',
                                async: false,
                                dataType: "json",
                                data: JSON.stringify({
                                    'input': {
                                        'node-id': nodeId,
                                        'x': allNodes[nodeId].x,
                                        'y': allNodes[nodeId].y
                                    }
                                })
                            });
                        }
                    }
                }

                cb(cloudPosition);
            }
        };

        return svc;
    }]);


});
