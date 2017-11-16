define(['app/topology/topology.module', 'app/topology/topology.services', 'app/topology/topology.directives', 'app/pm/pm.directives'], function(topology, service) {

    topology.register.controller('TopologyCtrl', ['$http', '$scope', '$rootScope', '$filter', '$state', '$timeout', '$interval', 'NetworkTopologySvc', 'PwTopologySvc', 'tunnelTopologySvc', 'SptnTopologySvc', 'SptnDelSvc', 'ServiceTopologySvc', 'ManagerTopologySvc', 'FlowMonitorTopologySvc', 'ENV', function($http, $scope, $rootScope, $filter, $state, $timeout, $interval, NetworkTopologySvc, PwTopologySvc, tunnelTopologySvc, SptnTopologySvc, SptnDelSvc, ServiceTopologySvc, ManagerTopologySvc, FlowMonitorTopologySvc, ENV) {
        $scope.physicalhide = "";
        $scope.pwhide = "hehe";
        $scope.tunnelhide = "hehe";
        $scope.checkneshow = false;
        $scope.bmap = {};
        $scope.bmap.hide = true;
        var nodeIds = [];
        $scope.service = {};
        $scope.service.pwhide = "hehe";

        var flowTopoTimer;
        var managerTopoTimer;
        var physicaTImer;
        $scope.physical = {};

        $rootScope['section_logo'] = 'assets/images/logo_topology.gif';
        var graphRenderer = null;

        $scope.createTopology = function() {
            $scope.physicalNodeId = "";
            SptnTopologySvc.getTopologyInfo(function(data) {
                $scope.topologyData = data;
            });
        };

        $scope.applyList = function(cb) {
            if (!$rootScope.$$phase) {
                $scope.$apply(cb);
            }
        };

        /*manager start*/
        $scope.manager = {};
        $scope.manager.managerhide = true;
        $scope.manager.managertabshow = true;
        $scope.manager.searchvalue = '';
        $scope.manager.managerselect = 'name';
        $scope.manager.topologyData = {};

        $scope.manager.handlerData = function() {
            ManagerTopologySvc.getInitData($scope.nodeLabel, function(data) {
                var tempCloudStatus = {};
                if (data.cloudExtNodes) {
                    for (var name in data.cloudExtNodes) {
                        var flag = true;

                        for (var topoid in $rootScope.managerTopologyStatus) {
                            if (name == topoid) {
                                tempCloudStatus[name] = $rootScope.managerTopologyStatus[topoid];
                                flag = false;
                            }
                        }

                        if (flag) {
                            tempCloudStatus[name] = false;
                        }
                    }
                }

                $.extend(true, $rootScope.managerTopologyStatus, tempCloudStatus);

                ManagerTopologySvc.initCloudData(data, $rootScope.managerTopologyStatus, function(topoData) {
                    if ($scope.manager.managerselect == 'name') {
                        //topoData.filterId = $scope.manager.searchvalue;
                        topoData.filterName = $scope.manager.searchvalue;
                    } else if ($scope.manager.managerselect == 'userlabel') {
                        topoData.filterUserLabel = $scope.manager.searchvalue;
                    }
                    $scope.manager.topologyData = topoData;
                    $scope.manager.refreshTime = $scope.manager.formatDateTime(new Date());
                    $scope.applyList(function() {
                        $scope.manager.refreshTime = $scope.manager.formatDateTime(new Date());
                    });
                });
            });
        };

        $scope.manager.searchManager = function() {
            clearInterval(managerTopoTimer);
            managerTopoTimer = null;
            $scope.manager.handlerData();
            Ext.Msg.alert($filter('translate')('Tips'), "搜索完成！");

            managerTopoTimer = setInterval(function() {
                if ($state.current.name != "main.topology") {
                    clearInterval(managerTopoTimer);
                    managerTopoTimer = null;
                }
                $scope.manager.handlerData();
            }, 1000 * 180);
        };

        $scope.manager.formatDateTime = function(myDate) {
            function formatTime(input) {
                var output = input;
                if (input >= 0 && input <= 9) {
                    output = '0' + input;
                }
                return output;
            }

            var dateTime = myDate.getFullYear() + "-" + formatTime(myDate.getMonth() + 1) + "-" + formatTime(myDate.getDate()) + " " + formatTime(myDate.getHours()) + ":" + formatTime(myDate.getMinutes()) + ":" + formatTime(myDate.getSeconds());

            return dateTime;
        };

        $scope.manager.toggle = function() {
            $scope.manager.searchvalue = '';
            $scope.service.pwhide = "hehe";
            $scope.manager.managerhide = false;
            $scope.physicalhide = "hehe";
            $scope.bmap.hide = true;
            $scope.flow.flowhide = true;

            clearInterval(flowTopoTimer);
            flowTopoTimer = null;

            clearInterval(physicaTImer);
            physicaTImer = null;

            ManagerTopologySvc.getInitData($scope.nodeLabel, function(data) {
                $rootScope.managerTopologyStatus = {};
                if (data.cloudExtNodes) {
                    for (var name in data.cloudExtNodes) {
                        $rootScope.managerTopologyStatus[name] = false;
                    }
                }

                ManagerTopologySvc.initCloudData(data, $rootScope.managerTopologyStatus, function(topoData) {
                    $scope.manager.topologyData = topoData;
                    $scope.manager.refreshTime = $scope.manager.formatDateTime(new Date());
                    $scope.applyList(function() {
                        $scope.manager.refreshTime = $scope.manager.formatDateTime(new Date());
                    });
                });
            });

            clearInterval(managerTopoTimer);
            managerTopoTimer = null;

            managerTopoTimer = setInterval(function() {
                if ($state.current.name != "main.topology") {
                    clearInterval(managerTopoTimer);
                    managerTopoTimer = null;
                }

                $scope.manager.handlerData();
            }, 1000 * 180);
        };

        /*manager end*/
        /*flow start*/
        $scope.flow = {};
        $scope.flow.flowhide = true;
        $scope.flow.searchvalue = '';
        $scope.flow.select = 'id';
        $scope.flow.topologyData = {};
        $scope.flow.loadType = 'none';
        $scope.parseFloat = parseFloat;

        /*链路状态颜色设置*/
        $scope.flow.linkSataus = function(color) {
            var oStyle = {
                'background-color': color,
                'display': 'inline-block',
                'width': '50px',
                'height': '5px'
            };

            return oStyle;
        };

        /*获取流量数据处理*/
        $scope.flow.handlerData = function() {
            FlowMonitorTopologySvc.getInitData($scope.nodeLabel, function(data) {
                /*判断新获取的云个数和状态与之前保存的云和状态比较*/
                var tempCloudStatus = {};
                if (data.cloudExtNodes) {
                    for (var name in data.cloudExtNodes) {
                        var flag = true;

                        for (var topoid in $rootScope.flowTopologyStatus) {
                            if (name == topoid) {
                                tempCloudStatus[name] = $rootScope.flowTopologyStatus[topoid];
                                flag = false;
                            }
                        }

                        if (flag) {
                            tempCloudStatus[name] = false;
                        }
                    }
                }

                $.extend(true, $rootScope.flowTopologyStatus, tempCloudStatus);

                /*根据云的状态出事云的数据模型*/
                FlowMonitorTopologySvc.initCloudData(data, $rootScope.flowTopologyStatus, function(topoData) {
                    topoData.filterType = $scope.flow.backloadType;
                    topoData.filterLinkName = $scope.flow.backsearchValue;

                    $scope.flow.topologyData = topoData;
                    $scope.flow.flowLinks = topoData.edges;
                    $scope.flow.refreshTime = $scope.manager.formatDateTime(new Date());
                    $scope.applyList(function() {
                        $scope.flow.refreshTime = $scope.manager.formatDateTime(new Date());
                    });
                    //alert("counts:" + ($scope.i ++));
                });
            });
        };

        /*点击查询按钮*/
        $scope.flow.searchBtnClick = function() {
            clearInterval(flowTopoTimer);
            flowTopoTimer = null;

            $('#flowTopoSearchModal').modal('hide');
            $scope.flow.backloadType = $scope.flow.loadType;
            $scope.flow.backsearchValue = $scope.flow.searchValue;

            $scope.flow.handlerData();

            flowTopoTimer = setInterval(function() {
                if ($state.current.name != "main.topology") {
                    clearInterval(flowTopoTimer);
                    flowTopoTimer = null;
                }

                $scope.flow.handlerData();
            }, 1000 * 180);
        };

        /*点击搜索按钮掏出啊查询详细框*/
        $scope.flow.searchManager = function() {
            $('#flowTopoSearchModal').modal('show');
        };

        /*点击流量监控页签*/
        $scope.flow.toggle = function() {
            $scope.service.pwhide = "hehe";
            $scope.flow.flowhide = false;
            $scope.physicalhide = "hehe";
            $scope.manager.managerhide = true;
            $scope.flow.loadType = 'none';
            $scope.flow.searchValue = '';
            $scope.bmap.hide = true;
            $scope.flow.backloadType = 'none';
            $scope.flow.backsearchValue = '';

            clearInterval(managerTopoTimer);
            managerTopoTimer = null;

            clearInterval(physicaTImer);
            physicaTImer = null;

            FlowMonitorTopologySvc.getInitData($scope.nodeLabel, function(data) {
                $rootScope.flowTopologyStatus = {};
                if (data.cloudExtNodes) {
                    for (var name in data.cloudExtNodes) {
                        $rootScope.flowTopologyStatus[name] = false;
                    }
                }

                FlowMonitorTopologySvc.initCloudData(data, $rootScope.flowTopologyStatus, function(topoData) {
                    $scope.flow.topologyData = topoData;
                    $scope.flow.flowLinks = topoData.edges;
                    $scope.flow.refreshTime = $scope.manager.formatDateTime(new Date());
                    $scope.applyList(function() {
                        $scope.flow.refreshTime = $scope.manager.formatDateTime(new Date());
                    });
                });
            });

            clearInterval(flowTopoTimer);
            flowTopoTimer = null;

            flowTopoTimer = setInterval(function() {
                if ($state.current.name != "main.topology") {
                    clearInterval(flowTopoTimer);
                    flowTopoTimer = null;
                }

                $scope.flow.handlerData();
            }, 1000 * 180);
        };

        $scope.$on('destroy', function() {
            clearInterval(flowTopoTimer);
            flowTopoTimer = null;

            clearInterval(managerTopoTimer);
            managerTopoTimer = null;

            clearInterval(physicaTImer);
            hysicaTImer = null;
        });

        if ($state.current.name == "main.pm.index") {
            $("#servicetitleclass").attr("class", "");
            $("#netitleclass").attr("class", "active");
            $("#opticaltitleclass").attr("class", "");
            $scope.togglePm(0);
        }
        /*flow end*/

        $scope.setTopologyData = function(data) {
            $scope.topologyData = data;
        };

        //$scope.createTopology();//默认执行

        $scope.physicalFilter = function() {
            $scope.physicalToggle();
        };

        $scope.physicalDelDownNodes = function() {

            SptnTopologySvc.getTopologyInfo(function(data) {

                if ($scope.physicalselect === "name") {
                    data.filterName = $scope.physicalvalue;
                } else {
                    data.filterLabel = $scope.physicalvalue;
                }

                //$scope.topologyData = data;

                var undelNodeIds = [];
                var undelNodeName = [];
                var undelNodeUserLabel = [];
                var delNodeIds = [];

                angular.forEach(data.nodes, function(nodeData) {
                    //输入为空
                    if (($scope.physicalvalue === undefined) || ($scope.physicalvalue === "")) {

                        if ((nodeData.status) === "operate-down") {
                            if (delNodeIds.indexOf(nodeData.id) === -1) {
                                delNodeIds.push(nodeData.id);
                            }
                        } else {
                            if (undelNodeIds.indexOf(nodeData.id) === -1) {
                                undelNodeIds.push(nodeData.id);
                                undelNodeName.push(nodeData.name);
                                undelNodeUserLabel.push(nodeData['userlabel']);
                            }
                        }
                    }

                    //模糊查询
                    if (data.filterName !== undefined && data.filterName && (nodeData.name).indexOf(data.filterName) !== -1) {

                        if (nodeData.status === "operate-down") {
                            if (delNodeIds.indexOf(nodeData.id) === -1) {
                                delNodeIds.push(nodeData.id);
                            }
                        } else {
                            if (undelNodeIds.indexOf(nodeData.id) === -1) {
                                undelNodeIds.push(nodeData.id);
                                undelNodeName.push(nodeData.name);
                                undelNodeUserLabel.push(nodeData['userlabel']);
                            }
                        }

                    }

                    //模糊查询
                    if (data.filterLabel !== undefined && data.filterLabel && (nodeData.userlabel).indexOf(data.filterLabel) !== -1) {

                        if (nodeData.status === "operate-down") {
                            if (delNodeIds.indexOf(nodeData.id) === -1) {
                                delNodeIds.push(nodeData.id);
                            }
                        } else {
                            if (undelNodeIds.indexOf(nodeData.id) === -1) {
                                undelNodeIds.push(nodeData.id);
                                undelNodeName.push(nodeData.name);
                                undelNodeUserLabel.push(nodeData['userlabel']);
                            }
                        }

                    }

                });

                console.log("delNodeIds:" + delNodeIds);

                if (undelNodeIds.length !== 0) {
                    var undeleteNodes;
                    if ($scope.nodeLabel == 'name') {
                        $.extend(true, undeleteNodes, undelNodeName);
                    } else {
                        $.extend(true, undeleteNodes, undelNodeUserLabel);
                    }
                    alert($filter('translate')('Cannot delete some operate-up nodes') + ":" + undeleteNodes);
                }

                console.log("undelNodeIds:" + undelNodeIds);
                SptnDelSvc.deleteFilterNodes({ 'node-ids': delNodeIds });

            });

            //$scope.createTopology();

            $(function() {
                setTimeout(function() {
                    $scope.createTopology();
                }, 1000);
            });

        };

        $scope.pwFilter = function() {
            PwTopologySvc.getAllPw(function(data) {
                data.filterId = $scope.pwIdF;
                data.filterLabel = $scope.pwUserLableF;
                $scope.pwData = data;
            });
        };

        $scope.pwFilter2 = function() {
            PwTopologySvc.getAllPw(function(data) {
                data.filterSrc = $scope.pwSrcNodeF;
                data.filterDes = $scope.pwDesNodeF;
                $scope.pwData = data;
            });
        };

        $scope.tunnelFilter = function() {
            tunnelTopologySvc.getAllTunnel(function(data) {
                data.filterId = $scope.tunnelIdF;
                data.filterName = $scope.tunnelNameF;
                $scope.tunnelData = data;
            });
        };

        $scope.tunnelFilter2 = function() {
            tunnelTopologySvc.getAllTunnel(function(data) {
                data.filterSrc = $scope.tunnelSrcNodeF;
                data.filterDes = $scope.tunnelDesNodeF;
                $scope.tunnelData = data;
            });
        };

        $scope.change = function(id) {
            if (id === 0) {
                $scope.checkneshow = !$scope.checkneshow;
            } else {
                $scope.checkbusshow = !$scope.checkbusshow;
            }
        };

        //更新节点user label
        $scope.updateNodeUserLabelById = function() {
            //不确定是更新内部节点还是外部节点
            console.log($('#updNodeId').val());
            console.log($('#updNodeUserLabel').val());
            var input = {
                'node-id': $('#updNodeId').val(),
                'userlabel': $('#updNodeUserLabel').val()
            };
            SptnTopologySvc.updateNodeUserLabelById(input, function(data) {
                if (data == 'success') {
                    $state.reload();
                }
            });
        };

        //根据外部节点id获取外部节点对象
        function getExtNodeById(extNodeId) {
            var extNode = {};
            var extNodeList = $scope.extNodes;
            if (extNodeList) {
                for (var i = 0; i < extNodeList.length; i++) {
                    if (extNodeList[i].id === extNodeId) {
                        extNode = extNodeList[i];
                        break;
                    }
                }

            }

            return extNode;
        }

        //判断传入的节点id是否存在于传入的节点集合中
        function isNodeIdExist(nodeList, nodeId) {
            var result = false; //默认不存在
            if (nodeList) {
                for (var i = 0; i < nodeList.length; i++) {
                    if (nodeList[i].id === nodeId) {
                        result = true;
                        break;
                    }
                }
            }
            return result;
        }

        //判断传入的节点是否存在于传入的节点集合中
        function isNodeExist(nodeList, node) {
            var result = false; //默认不存在
            if (nodeList) {
                for (var i = 0; i < nodeList.length; i++) {
                    if (nodeList[i].id === node.id) {
                        result = true;
                        break;
                    }
                }
            }
            return result;
        }

        //判断传入的链路是否存在于传入的链路集合中
        function isLinkExist(linkList, link) {
            var result = false; //默认不存在
            if (linkList) {
                for (var i = 0; i < linkList.length; i++) {
                    if (linkList[i].from === link.from && linkList[i].to === link.to) {
                        result = true;
                        break;
                    }
                }
            }
            return result;
        }

        //删除重复链路
        function formatLinks(links) {

            var linkList = [];

            if (links !== undefined) {
                var flag = true;
                for (var a = 0; a < links.length; a++) {
                    for (var b = a + 1; b < links.length; b++) {
                        var aa = links[a]['from'] + links[a]['left-ltp-id'] + links[a]['to'] + links[a]['right-ltp-id'];
                        var bb = links[b]['from'] + links[b]['left-ltp-id'] + links[b]['to'] + links[b]['right-ltp-id'];
                        var cc = links[b]['to'] + links[b]['right-ltp-id'] + links[b]['from'] + links[b]['left-ltp-id'];

                        if (aa == bb || aa == cc) {
                            flag = false;
                            break;
                        }
                    }

                    if (flag) {
                        //避免link的左右节点在所有sdn节点和外部节点集合中找不到，整个拓扑图无法绘制的情况
                        if ($scope.allNodesAndExtNodes) { //只要link的左右节点有任意一个在所有sdn节点和外部节点集合中炸不到，该link就不绘制
                            if (isNodeIdExist($scope.allNodesAndExtNodes, links[a].from) === true && isNodeIdExist($scope.allNodesAndExtNodes, links[a].to) === true) {
                                linkList.push(links[a]);
                            }
                        }
                        //linkList.push(links[a]);
                    }

                    flag = true;
                }
            }

            return linkList;

        }


        var getAllIconNodes = function() {
            //获取所有sdn节点
            SptnTopologySvc.getAllIconNodes($scope.nodeLabel, function(data) {

                var nodeList = [];

                angular.forEach(data, function(node) {
                    var nodeId = node.id;
                    if (nodeId.indexOf("openflow") !== -1) {
                        nodeList.push(node);
                    }
                });

                $scope.nodes = nodeList;
            });
        };

        var getAllLinks = function() {

            SptnTopologySvc.getAllLinks(function(data) {

                $scope.links = formatLinks(data);

            });

        };

        var getAllExtNodes = function() {
            //获取所有外部节点
            SptnTopologySvc.getAllExtNodes($scope.nodeLabel, function(data) {
                $scope.extNodes = data;
            });
        };

        var getAllExtLinks = function() {
            //获取所有外部链路
            SptnTopologySvc.getAllExtLinks(function(data) {
                var extLinks = data;
                //统一from为sdn节点id to为外部节点id
                angular.forEach(extLinks, function(extLink) {
                    var extLinkOgnFrom = extLink.from; //原始from id
                    var extLinkOgnTo = extLink.to; //原始to id
                    //如果不是to为外部节点id 则调整
                    if (isNodeExist($scope.extNodes, getExtNodeById(extLink.to)) === false) {
                        extLink.from = extLinkOgnTo;
                        extLink.to = extLinkOgnFrom;
                    }
                });

                $scope.extLinks = formatLinks(extLinks);
                //$scope.extLinks = formatLinks(data);
            });
        };

        function getDeviceTypeIcons(type, form) {
            var input = {
                'device-type': type
            };

            SptnTopologySvc.getDeviceIcons(input, function(data) {
                if (data) {
                    var radiogroup = form.down('radiogroup');
                    var items = [];

                    //get checekded icon api
                    angular.forEach(data['device-icon'], function(icon, index) {
                        var checked = false;
                        if (icon == data['icon-used']) {
                            checked = true;
                        }

                        var item = new Ext.form.field.Radio({
                            boxLabel: '<img src="assets/images/' + icon + '-up.png" style="width:50px;height:50px;">',
                            name: 'device-icon',
                            inputValue: icon,
                            checked: checked
                        });

                        items.push(item);
                    });
                    radiogroup.removeAll();
                    radiogroup.add(items);
                }
            });
        }

        function showNodeInfoWin() {
            var deviceTypeStore = Ext.create('Ext.data.Store', {
                fields: [
                    { name: 'type', type: 'string' },
                    { name: 'value', type: 'string' }
                ],
                proxy: {
                    type: 'memory',
                    reader: {
                        type: 'json'
                    }
                },
                data: []
            });

            var form = Ext.create('Ext.form.Panel', {
                frame: true,
                bodyPadding: 10,
                autoScroll: true,
                defaultType: 'textfield',
                fieldDefaults: {
                    labelAlign: 'right',
                    labelWidth: 120,
                    labelStyle: 'padding-left:0px;',
                    msgTarget: 'side'
                },
                layout: 'anchor',
                defaults: {
                    anchor: '95%'
                },
                items: [{
                        xtype: 'combobox',
                        name: 'device-type',
                        fieldLabel: $filter('translate')('Device Type'),
                        displayField: 'type',
                        valueField: 'value',
                        store: deviceTypeStore,
                        queryMode: 'local',
                        listeners: {
                            'change': function() {
                                if (this.getValue()['device-type']) {
                                    getDeviceTypeIcons(this.getValue()['device-type'], form);
                                }

                            }
                        }
                    },
                    { xtype: 'radiogroup', fieldLabel: $filter('translate')('Device Icon'), columns: 2, vertical: true }
                ],
                buttons: [{
                    text: $filter('translate')('Cancel'),
                    iconCls: 'x-fa fa-remove',
                    handler: function() {
                        this.up('window').close();
                    }
                }, {
                    text: $filter('translate')('Save'),
                    iconCls: 'x-fa fa-save',
                    handler: function() {
                        var win = this.up('window');
                        var form = this.up('form').getForm();

                        if (form.isValid()) {
                            var input = {
                                'device-type': form.getValues()['device-type'],
                                'device-icon': form.getValues()['device-icon']
                            };

                            SptnTopologySvc.updateDeviceIcons(input, function(data) {
                                if (data == 'success') {
                                    win.destroy();
                                    $scope.applyList($scope.physicalToggle());
                                } else {
                                    Ext.Msg.alert($filter('translate')('Tips'), $filter('translate')('SaveSuccess'));
                                }
                            });
                        }
                    }
                }]
            });
            var win = Ext.widget('window', {
                title: $filter('translate')('Node Info'),
                border: false,
                layout: 'fit',
                width: 500,
                height: 450,
                resizable: true,
                modal: true,
                items: form
            });

            SptnTopologySvc.getDeviceType(function(data) {
                if (data && data.length > 0) {
                    deviceTypeStore.removeAll();
                    deviceTypeStore.loadData(data);
                    var combobox = form.down('combobox');
                    combobox.setValue(data[0].value);
                    var select = data[0].value;

                    if (select) {
                        getDeviceTypeIcons(select, form);
                    }
                }
            });

            win.show();
        }

        //config shou name  or userlabel and node image
        $scope.nodeLabel = 'userlabel';
        $rootScope.gNodeLabel = 'userlabel';
        $scope.datalinkshowUserlabel = true;
        $scope.datalinkshowName = false;

        $scope.configTopoShowName = function() {
            showConfigNodeWin();
        };

        $scope.configTopoShowName = function() {
            $scope.nodeLabel = 'name';
            $rootScope.gNodeLabel = 'name';
            $scope.physicalToggle();
            $scope.datalinkshowName = true;
            $scope.datalinkshowUserlabel = false;
        };

        $scope.configTopoShowUserlabel = function() {
            $scope.nodeLabel = 'userlabel';
            $rootScope.gNodeLabel = 'userlabel';
            $scope.physicalToggle();
            $scope.datalinkshowUserlabel = true;
            $scope.datalinkshowName = false;
        };

        $scope.configNodeIcon = function() {
            showNodeInfoWin();
        };

        getAllIconNodes();

        getAllExtNodes();

        $scope.allNodesAndExtNodes = [];
        $scope.allNodesAndExtNodes = $scope.allNodesAndExtNodes.concat($scope.nodes);
        if ($scope.extNodes !== undefined) {
            $scope.allNodesAndExtNodes = $scope.allNodesAndExtNodes.concat($scope.extNodes);
        }

        getAllLinks();

        getAllExtLinks();

        $scope.allLinksAndExtLinks = [];
        if ($scope.links) {
            $scope.allLinksAndExtLinks = $scope.allLinksAndExtLinks.concat($scope.links);
        }

        if ($scope.extLinks !== undefined) {
            $scope.allLinksAndExtLinks = $scope.allLinksAndExtLinks.concat($scope.extLinks);
        }

        $scope.createExtNode = function(extNode) {
            //创建的外部节点id不能与已有的普通节点或外部节点的id相同
            if ($scope.allNodesAndExtNodes !== undefined) {
                var allNodesAndExtNodes = $scope.allNodesAndExtNodes;
                var flag = false;
                for (var i = 0; i < allNodesAndExtNodes.length; i++) {
                    if (allNodesAndExtNodes[i].id === extNode.id) {
                        flag = true;
                        break;
                    }
                }
                if (flag === true) {
                    alert($filter('translate')('ID of the extnode you want to create already existed'));
                    return;
                }

            }

            if (extNode.id === extNode['parent-topo-id']) {
                alert($filter('translate')('ID cannot equal with parent topo id'));
                return;
            }

            SptnTopologySvc.createExtNode(extNode, function(response) {
                if (response === "Error") {
                    alert($filter('translate')('Create extnode unsuccessfully'));
                } else {
                    alert($filter('translate')('Create extnode successfully'));
                    $("#createExtNodeModal").modal("hide");
                    $state.reload();
                }
            });
        };

        $scope.createExtLink = function(extLink) {

            var ognLeftLtpId = extLink['left-ltp-id'];
            var ognRightLtpId = extLink['right-ltp-id'];

            extLink['left-ltp-id'] = extLink['left-node-id'] + ":" + extLink['left-ltp-id'];
            extLink['right-ltp-id'] = extLink['right-node-id'] + ":" + extLink['right-ltp-id'];

            extLink['left-ltp-name'] = ognLeftLtpId;
            extLink['right-ltp-name'] = ognRightLtpId;

            extLink['left-ltp-user-label'] = ognLeftLtpId;
            extLink['right-ltp-user-label'] = ognRightLtpId;

            //创建的外部链路不能与已有的普通链路或外部链路的id相同
            if ($scope.allLinksAndExtLinks !== undefined) {
                var allLinksAndExtLinks = $scope.allLinksAndExtLinks;
                var flag = false;
                for (var i = 0; i < allLinksAndExtLinks.length; i++) {
                    if (allLinksAndExtLinks[i].id === extLink.id) {
                        flag = true;
                        break;
                    }
                }
                if (flag === true) {
                    alert($filter('translate')('ID of the extlink you want to create already existed'));
                    extLink['left-ltp-id'] = ognLeftLtpId;
                    extLink['right-ltp-id'] = ognRightLtpId;
                    return;
                }

            }

            var allNodes = $scope.allNodesAndExtNodes;
            for (var j = 0; j < allNodes.length; j++) {
                if (allNodes[j].id == extLink['left-node-id']) {
                    extLink['left-node-name'] = allNodes[j]['name'];
                    extLink['left-node-user-label'] = allNodes[j]['user-label'];
                }

                if (allNodes[j].id == extLink['right-node-id']) {
                    extLink['right-node-name'] = allNodes[j]['name'];
                    extLink['right-node-user-label'] = allNodes[j]['user-label'];
                }
            }

            SptnTopologySvc.createExtLink(extLink, function(response) {
                if (response === "Error") {
                    alert($filter('translate')('Create extlink unsuccessfully'));
                    extLink['left-ltp-id'] = ognLeftLtpId;
                    extLink['right-ltp-id'] = ognRightLtpId;
                } else {
                    alert($filter('translate')('Create extlink successfully'));
                    $("#createExtLinkModal").modal("hide");
                    $state.reload();
                }
            });
        };

        $scope.physicalselect = "name";
        $scope.physicalNodeId = "";
        $scope.physicalUserLabel = "";

        $scope.physicalToggle = function(init) {
            if (init) {
                $scope.physicalNodeId = "";
                $scope.physicalUserLabel = "";
                $scope.physicalselect = "name";
                $scope.physicalhide = "";
                $scope.pwhide = "hehe";
                $scope.tunnelhide = "hehe";
                $scope.service.pwhide = "hehe";
                $scope.manager.managerhide = true;
                $scope.bmap.hide = true;
                $scope.flow.flowhide = true;
            }

            clearInterval(flowTopoTimer);
            flowTopoTimer = null;

            clearInterval(managerTopoTimer);
            managerTopoTimer = null;

            //遍历外部节点集合 确定要画几朵云
            function getExtPrtTopoIdStr(extNodes) {
                var extPrtTopoIdStr = "";
                //通过接口获取的外部节点集合为空 则显示sdn节点的拓扑图
                if (extNodes !== undefined && extNodes !== []) {
                    //通过接口获取的外部节点集合不为空 则显示外部节点和sdn节点的拓扑图
                    angular.forEach(extNodes, function(extNode) {
                        if (extPrtTopoIdStr.indexOf(extNode['parent-topo-id']) === -1) {
                            extPrtTopoIdStr += extNode['parent-topo-id'];
                            extPrtTopoIdStr += ";";
                        }
                    });
                    console.log(extPrtTopoIdStr);
                }
                return extPrtTopoIdStr;
            }

            //根据外部节点id获取对应parent-topo-id
            function getPrtTopoId(extNodeId) {

                var extNodes = $scope.extNodes;
                var extPrtTopoId;

                for (var i = 0; i < extNodes.length; i++) {
                    var extNode = extNodes[i];
                    if (extNode.id === extNodeId) {
                        extPrtTopoId = extNode['parent-topo-id'];
                        break;
                    }
                }
                return extPrtTopoId;

            }

            function getSingleExtNodes(extNodes, extLinks) {
                var result = false; //默认不是孤立的外部节点
                var singleExtNodes = [];
                for (var i = 0; i < extNodes.length; i++) {
                    result = false;
                    for (var j = 0; j < extLinks.length; j++) {
                        if (extNodes[i].id === extLinks[j].from || extNodes[i].id === extLinks[j].to) {
                            result = true;
                            break;
                        }
                    }

                    if (result === false) {
                        singleExtNodes.push(extNodes[i]);
                    }
                }
                if (singleExtNodes.length === 0) {
                    singleExtNodes = "";
                }

                return singleExtNodes;
            }

            function physicalHandlerData() {
                SptnTopologySvc.getTopoIds(function(data) {
                    $scope.topoIds = data;
                });


                //获取所有外部节点
                SptnTopologySvc.getAllExtNodes($scope.nodeLabel, function(data) {
                    $scope.extNodes = data;
                });

                //获取所有外部链路
                SptnTopologySvc.getAllExtLinks(function(data) {
                    var extLinks = data;
                    //统一from为sdn节点id to为外部节点id
                    angular.forEach(extLinks, function(extLink) {
                        var extLinkOgnFrom = extLink.from; //原始from id
                        var extLinkOgnTo = extLink.to; //原始to id
                        //如果不是to为外部节点id 则调整
                        if (isNodeExist($scope.extNodes, getExtNodeById(extLink.to)) === false) {
                            extLink.from = extLinkOgnTo;
                            extLink.to = extLinkOgnFrom;
                        }
                    });

                    $scope.extLinks = formatLinks(extLinks);

                    //$scope.extLinks = extLinks;
                });


                //获取所有sdn节点
                SptnTopologySvc.getAllIconNodes($scope.nodeLabel, function(data) {
                    var extPrtTopoIdStr = getExtPrtTopoIdStr($scope.extNodes);
                    var nodeList = [];

                    angular.forEach(data, function(node) {
                        var nodeId = node.id;
                        if (nodeId.indexOf("openflow") !== -1) {
                            nodeList.push(node);
                        }
                    });

                    //确定在外部节点集合中要加入几朵云
                    if ($scope.extLinks !== undefined && extPrtTopoIdStr !== "") {
                        var extPrtTopoIdList = extPrtTopoIdStr.split(";");
                        var len = extPrtTopoIdList.length - 1;
                        for (var i = 0; i < len; i++) {
                            var cloud = {};
                            cloud.id = 'cloud:' + extPrtTopoIdList[i];
                            cloud.label = '';
                            cloud.group = 'cloud';
                            cloud.size = 45;
                            if ($rootScope[cloud.id]) {
                                cloud.x = $rootScope[cloud.id].x;
                                cloud.y = $rootScope[cloud.id].y;
                            }
                            /*
                            var cExtNode = getExtNodeById($scope.extLinks[0].to);
                            cloud.x = cExtNode.x + 60;
                            cloud.y = cExtNode.y + 60;
                            */
                            cloud.title = 'ID:  ' + cloud.id;
                            if (isNodeExist(nodeList, cloud) === false) {
                                nodeList.push(cloud);
                            }
                        }
                    }

                    $scope.nodes = nodeList;
                });

                //获取所有sdn节点之间的链路
                SptnTopologySvc.getAllLinks(function(data) {

                    $scope.links = formatLinks(data);

                });


                var links0 = $scope.links;

                var extPrtTopoIdStr = getExtPrtTopoIdStr($scope.extNodes);
                var filterName;
                var filterLabel;

                if ($scope.physicalselect === "name") {
                    filterName = $scope.physicalvalue;
                } else {
                    filterLabel = $scope.physicalvalue;
                }

                if (extPrtTopoIdStr === "") { //没有外部节点

                    $scope.topologyData = {
                        extPrtTopoIdStr: extPrtTopoIdStr,
                        data: {
                            nodes: $scope.nodes,
                            edges: $scope.links
                        },
                        filterName: filterName,
                        filterLabel: filterLabel
                    };
                } else { //有外部节点
                    if ($scope.extLinks === undefined) { //没有外部链路
                        var nodes = $scope.nodes;
                        nodes = nodes.concat($scope.extNodes);
                        $scope.topologyData = {
                            extPrtTopoIdStr: extPrtTopoIdStr, //
                            data: {
                                nodes: nodes,
                                edges: $scope.links
                            },
                            filterName: filterName,
                            filterLabel: filterLabel
                        };
                    } else { //有外部链路
                        //nodes0只包括sdn节点和云节点
                        //重新获取外部节点和外部链路
                        //获取所有外部节点
                        SptnTopologySvc.getAllExtNodes($scope.nodeLabel, function(data) {
                            $scope.extNodes = data;
                        });

                        //获取所有外部链路
                        SptnTopologySvc.getAllExtLinks(function(data) {
                            var extLinks = data;
                            //统一from为sdn节点id to为外部节点id
                            angular.forEach(extLinks, function(extLink) {
                                var extLinkOgnFrom = extLink.from; //原始from id
                                var extLinkOgnTo = extLink.to; //原始to id
                                //如果不是to为外部节点id 则调整
                                if (isNodeExist($scope.extNodes, getExtNodeById(extLink.to)) === false) {
                                    extLink.from = extLinkOgnTo;
                                    extLink.to = extLinkOgnFrom;
                                }
                            });
                            $scope.extLinks = formatLinks(extLinks);
                            //$scope.extLinks = extLinks;
                        });

                        var singleExtNodes = getSingleExtNodes($scope.extNodes, $scope.extLinks);

                        if (singleExtNodes !== "") {
                            $scope.singleExtNodes = singleExtNodes;
                            var nodes00 = $scope.nodes;
                            var nodes11 = [];
                            for (var a = 0; a < nodes00.length; a++) {
                                var flag = false;
                                for (var b = 0; b < singleExtNodes.length; b++) {
                                    //如果nodes00[a]为云节点
                                    if (nodes00[a].group === 'cloud' && nodes00[a].id === ('cloud:' + singleExtNodes[b]['parent-topo-id'])) {
                                        flag = true;
                                        //如果孤立节点的parent topo id为已有id为extLink.to的外部节点的parent topo id，则也加入nodes11
                                        if ($scope.extLinks !== undefined) {
                                            for (var c = 0; c < $scope.extLinks.length; c++) {
                                                var tExtNode = getExtNodeById($scope.extLinks[c].to);

                                                if (nodes00[a].id === ('cloud:' + tExtNode['parent-topo-id'])) {
                                                    if (isNodeExist(nodes11, nodes00[a]) === false) {
                                                        nodes11.push(nodes00[a]);
                                                    }
                                                }

                                            }

                                        }
                                    }
                                }
                                //如果为内部节点 则加入nodes11
                                if (flag === false) {
                                    if (isNodeExist(nodes11, nodes00[a]) === false) {
                                        nodes11.push(nodes00[a]);
                                    }
                                }

                            }
                            $scope.nodes = nodes11;
                        } else {
                            $scope.singleExtNodes = "";
                        }

                        var nodes0 = [];
                        nodes0 = nodes0.concat($scope.nodes);

                        var nodes1 = {}; //nodes1对应点击云之前 每朵云的外部节点集合为空
                        var nodes2 = {}; //nodes2对点击云之后 应每朵云的外部节点集合

                        var links1 = {}; //links1对应点击云之前 每朵云的sdn节点与云节点的链路集合
                        var links2 = {}; //links2对应点击云之后 每朵云的外部节点与云节点的链路集合

                        var extLinks1 = {}; //extLinks1对应点击云之前 每朵云的sdn节点与外部节点的链路集合为空
                        var extLinks2 = {}; //extLinks1对应点击云之后 每朵云的sdn节点与外部节点的链路集合


                        //初始化
                        angular.forEach($scope.extLinks, function(extLink) {
                            var prtTopoId = getPrtTopoId(extLink.to);
                            links1[prtTopoId] = [];
                            links2[prtTopoId] = [];
                            nodes1[prtTopoId] = [];
                            nodes2[prtTopoId] = [];
                            extLinks1[prtTopoId] = [];
                            extLinks2[prtTopoId] = [];
                        });


                        angular.forEach($scope.extLinks, function(extLink) {
                            //获取外部节点的parent-topo-id
                            var prtTopoId = getPrtTopoId(extLink.to);

                            var link1 = {};
                            link1.color = {};
                            link1.from = extLink.from;

                            link1.to = "cloud:" + prtTopoId;
                            link1.dashes = false; //link1.style = 'line';
                            //link1.length = 60;
                            link1.color.color = 'blue';
                            link1.color.highlight = 'blue';
                            links1[prtTopoId].push(link1);

                            var link2 = {};
                            link2.color = {};
                            link2.from = "cloud:" + prtTopoId;
                            link2.to = extLink.to;
                            link2.dashes = true; //link2.style = 'dash-line';
                            //link2.length = 60;
                            link2.color.color = 'gray';
                            link2.color.highlight = 'gray';

                            if (isLinkExist(links2[prtTopoId], link2) === false) {
                                links2[prtTopoId].push(link2);
                            }

                            var extNode = getExtNodeById(extLink.to);

                            //每朵云对应的nodes2中不允许存入重复的外部节点
                            if (isNodeExist(nodes2[prtTopoId], extNode) === false) {
                                nodes2[prtTopoId].push(extNode);
                            }

                            extLinks2[prtTopoId].push(extLink);

                        });

                        $scope.topologyData = {
                            nodes0: nodes0,
                            nodes1: nodes1,
                            nodes2: nodes2,
                            links1: links1,
                            links2: links2,
                            links0: links0,
                            extLinks1: extLinks1,
                            extLinks2: extLinks2,
                            singleExtNodes: $scope.singleExtNodes,
                            extPrtTopoIdStr: extPrtTopoIdStr,
                            filterName: filterName,
                            filterLabel: filterLabel
                        };

                    }

                }

                $scope.physical.refreshTime = $scope.manager.formatDateTime(new Date());
                $scope.applyList(function() {
                    $scope.physical.refreshTime = $scope.manager.formatDateTime(new Date());
                });
            }

            clearInterval(physicaTImer);
            physicaTImer = null;

            physicalHandlerData();

            physicaTImer = setInterval(function() {
                if ($state.current.name != "main.topology") {
                    clearInterval(physicaTImer);
                    physicaTImer = null;
                }

                physicalHandlerData();
            }, 1000 * 3 * 60);

        };


        $scope.physicalToggle('init'); //进入界面默认执行

        document.addEventListener("copy", function(e) {
            $scope.pasteStr = window.getSelection().toString();
        }, false);

        $scope.term = [];
        $scope.jp = [];
        $scope.num = 0;

        $scope.connInfo = [];

        $(':input', '#topoConnForm').not(':button, :submit, :reset, :hidden').val(''); //清空表单

        //初始化每个节点连接的次数 第一次连接需要登录
        $scope.connCount = {};
        $rootScope.connFlag = {};
        $scope.connData = {};

        if ($scope.nodes) {
            angular.forEach($scope.nodes, function(node) {
                $scope.connCount[node.id] = 1;
                $rootScope.connFlag[node.id] = false;
                $scope.connData[node.id] = "";
            });
        }

        function sendMessage(websocket, msg) {
            waitForSocketConnection(websocket, function() {
                websocket.send(msg);
            });
        }


        function waitForSocketConnection(socket, callback) {
            setTimeout(
                function() {
                    if (socket.readyState === 1) {
                        if (callback !== undefined) {
                            callback();
                        }
                        return;
                    } else {
                        waitForSocketConnection(socket, callback);
                    }
                }, 100);
        }

        function deleteSpecialChar(text) {
            if (text.indexOf("\r") !== -1) { //从后台传过来的字符串末尾会多一个\r字符串
                text = text.substring(0, text.length - 1);
            }
            text = text.replace(/0m/g, 'm').replace(/01;31m/g, 'm');
            text = text.replace(/01;32m/g, 'm').replace(/01;33m/g, 'm').replace(/01;34m/g, 'm');
            text = text.replace(/01;35m/g, 'm').replace(/01;36m/g, 'm').replace(/01;37m/g, 'm');
            text = text.replace(/\[\m/g, '').replace(/\[\K/g, '').replace(/[\[\]]/g, '');

            var strArr = [];
            var special;
            for (var k = 0; k < 17; k++) {
                special = String.fromCharCode(k);
                strArr = text.split(special);
                text = strArr.join("");
            }

            special = String.fromCharCode(27);
            strArr = text.split(special);
            text = strArr.join("");
        }

        function findStr(str, strList) {
            var flag = false;
            for (var i = 0; i < strList.length; i++) {
                if (str.indexOf(strList[i]) !== -1) {
                    flag = true;
                    break;
                }
            }
            return flag;
        }

        function getExtNodeUserLabelById(nodeId) {
            var nUserLabel;
            SptnTopologySvc.getExtNodeUserLabelById(nodeId, function(data) {
                nUserLabel = data;
            });
            return nUserLabel;
        }

        function getNodeUserLabelById(nodeId) {
            var nUserLabel;
            SptnTopologySvc.getNodeUserLabelById(nodeId, function(data) {
                nUserLabel = data;
            });
            if (nUserLabel === undefined) {
                nUserLabel = getExtNodeUserLabelById(nodeId);
            }
            return nUserLabel;
        }

        $scope.wsList = [];

        var loginStrList = ["Input port", "Input UserName", "Input Password"];

        $(':input', '#topoConnForm').not(':button, :submit, :reset, :hidden').val(''); //清空表单

        $scope.topoConnect = function() {

            //terminal start
            function wsOpen(rClickNodeId, protocal, topoConnUser) {

                var wsUri = ENV.getBaseURL("MD_SAL").replace(/http/, "ws").replace(/8080/, 9001).replace(/8181/, 9001) + "/" + protocal;

                //var wsUri = "ws://echo.websocket.org/";
                //var wsUri = "ws://172.16.75.111:9191/";

                var nodeId = rClickNodeId;
                if (rClickNodeId && isNaN(rClickNodeId) && rClickNodeId.indexOf(':') !== -1) {
                    nodeId = nodeId.replace(/:/g, '');
                }

                console.log("wsUri:" + wsUri);

                $scope.websocket = new WebSocket(wsUri);
                var wsObj = {};
                wsObj.nodeId = nodeId;
                wsObj.ws = $scope.websocket;

                if ($scope.wsList.length !== 0) {

                    var wsExit = false;
                    for (var s = 0; s < $scope.wsList.length; s++) {
                        if ($scope.wsList.nodeId === nodeId) {
                            wsExit = true;
                            break;
                        }
                    }

                    if (wsExit === false) {
                        $scope.wsList.push(wsObj);
                    }
                } else {
                    $scope.wsList.push(wsObj);
                }

                $scope.websocket.onopen = function(evt) {
                    console.log("connecting...");
                };

                $scope.websocket.onclose = function(evt) {
                    console.log("websocket closed");
                    console.log("websocket " + getNodeUserLabelById(rClickNodeId) + " closed");
                };

                $scope.websocket.onmessage = function(evt) {
                    console.log("receive:" + evt.data);
                    var nameStr = topoConnUser.name.substring(0, 1).toUpperCase() + topoConnUser.name.substring(1);
                    var loginEndStrList = [topoConnUser.name + "@", nameStr + "@", topoConnUser.name + "#", nameStr + "#", "Password"];
                    if (findStr(evt.data, loginStrList) === false) {
                        deleteSpecialChar(evt.data);
                        $scope.successLoginInfo.push(evt.data);
                        if (findStr(evt.data, loginEndStrList) === true) {
                            $rootScope.connFlag[rClickNodeId] = true;
                            SptnTopologySvc.mergeNodeConnInfo(protocal, rClickNodeId, topoConnUser); //保存节点登录信息
                            termOpen(rClickNodeId); //登录成功 打开终端窗口
                        }
                    }
                    $scope.recData = evt.data;
                    $scope.connInfo.push(evt.data);
                };

                $scope.websocket.onerror = function(evt) {
                    console.log("websocket error");
                    alert("websocket error");
                };

            }

            var topoConnUser = {};

            topoConnUser.ip = $('#topoconn-ip').val();
            topoConnUser.port = $('#topoconn-port').val();
            topoConnUser.name = $('#topoconn-username').val();
            topoConnUser.pwd = $('#topoconn-pwd').val();

            $(':input', '#topoConnForm').not(':button, :submit, :reset, :hidden').val(''); //清空表单

            $scope.successLoginInfo = []; //每次登录都清空登录成功信息
            $scope.nodeUserLabel = getNodeUserLabelById($rootScope.rClickNodeId);

            // console.log("node: "+ getNodeUserLabelById($rootScope.rClickNodeId));

            var newNodeId = $rootScope.rClickNodeId;
            if ($rootScope.rClickNodeId && isNaN($rootScope.rClickNodeId) && $rootScope.rClickNodeId.indexOf(':') !== -1) {
                newNodeId = $rootScope.rClickNodeId.replace(/:/g, '');
            }

            var termExist = false;
            for (var p = 0; p < $scope.wsList.length; p++) {
                if ($scope.wsList[p].nodeId === newNodeId) {
                    termExist = true;
                    break;
                }
            }


            if ($rootScope.rClickNodeId && topoConnUser) {
                //如果当前设备窗口已打开，则不打开新的窗口
                if ($scope.connCount[$rootScope.rClickNodeId] > 1 && $('#jsPanel-' + newNodeId).length) {
                    $('#topoConnModal').modal('hide');
                    return;
                } else {
                    wsOpen($rootScope.rClickNodeId, $rootScope.protocal, topoConnUser);
                }

                $scope.connCount[$rootScope.rClickNodeId]++;

                var topoConnInfo = [];

                // var protocal = $rootScope.protocal;
                // topoConnInfo[0] = protocal;

                var ip = topoConnUser.ip;
                topoConnInfo[0] = ip;

                var port = topoConnUser.port;
                topoConnInfo[1] = port;

                var userName = topoConnUser.name;
                topoConnInfo[2] = userName;

                var pwd = topoConnUser.pwd;
                topoConnInfo[3] = pwd;

                for (var i = 0; i < 4; i++) {
                    console.log('send:' + topoConnInfo[i]);
                    sendMessage($scope.websocket, topoConnInfo[i]);
                }


                $('#topoConnModal').modal('hide');
                var rClickNodeId = $rootScope.rClickNodeId;
                if (rClickNodeId && isNaN(rClickNodeId) && rClickNodeId.indexOf(':') !== -1) {
                    rClickNodeId = rClickNodeId.replace(/:/g, '');
                }
                $scope.frontTmlId = rClickNodeId;

            }


            function termOpen(n) {

                var m = n;
                if (n && isNaN(n) && n.indexOf(':') !== -1) {
                    m = n.replace(/:/g, '');
                }
                $scope.m = m;

                if (!$scope.term[m] || ($scope.term[m] && $scope.term[m].closed)) {
                    var copy = $('#terminal0').clone(true);
                    $(copy).attr('id', 'terminal' + m);

                    $(copy).css('margin', 0);
                    $(copy).css('padding', 0);
                    $(copy).css('float', 'left');
                    $(copy).css('border-color', '#eeeeee');

                    var termDiv = $(copy).find("div[name='termDiv']");
                    $(termDiv).attr('id', 'termDiv' + m);
                    var offsetX, offsetY;
                    //避免多个窗口重叠
                    if (!m || isNaN(m)) {
                        $scope.num++;
                        offsetX = 30 + $scope.num * 20;
                        offsetY = 30 + $scope.num * 20;
                    } else {
                        offsetX = 30 + parseInt(m) * 20;
                        offsetY = 30 + parseInt(m) * 20;
                    }
                    $scope.jp[m] = $.jsPanel({
                        position: { my: "center-top", at: "center-top", offsetX: offsetX, offsetY: offsetY },
                        theme: "#4b4943",
                        id: 'jsPanel-' + m,
                        contentSize: { width: 708, height: 420 },
                        headerTitle: "Terminal " + getNodeUserLabelById(n) + " (" + $rootScope.protocal + ")",
                        container: '#topoDiv',
                        // dragit: {
                        //     containment: 'parent',
                        // },
                        // draggable: {
                        //     containment: "parent",
                        // },
                        callback: function() {
                            this.content.css("padding", "0px");
                        }
                    });

                    var jpContent = $('#jsPanel-' + m).find("div[class='jsPanel-content jsPanel-content-nofooter']");
                    $(jpContent).css('background-color', '#300a24');
                    $(jpContent).css('overflow-x', 'scroll');
                    $(jpContent).css('overflow-y', 'scroll');
                    jpContent.append(copy);
                    $scope.term[m] = new Terminal({
                        x: 0,
                        y: 0,
                        id: m,
                        termDiv: 'termDiv' + m,
                        frameWidth: 0,
                        frameColor: '#eeeeee',
                        bgColor: '#300a24',
                        ps: '',
                        crsrBlinkMode: true,
                        blink_delay: 1000,
                        // greeting: 'Terminal ' + n + ' ready.',
                        greeting: $scope.successLoginInfo, //登录成功显示信息
                        handler: termHandler,
                        exitHandler: termExitHandler
                    });

                    if ($scope.term[m]) {
                        termChromeShow(m);
                        $scope.term[m].open();
                    }

                }

                if ($scope.term[m] && !$scope.term[m].closed) {
                    termChromeShow(m);
                    if ($scope.jp[m]) {
                        $scope.jp[m].front(function() {
                            console.log('front to: ' + m);
                        });
                    }
                }

                //获取粘贴板内容
                function getCallBackStr(str) {
                    console.log(str);
                    var frontTmlId = $scope.frontTmlId;
                    //哪个终端在最前方 则粘贴到哪个终端窗口
                    pasteProcess($scope.term[frontTmlId], str);
                }

                $('#jsPanel-' + m).bind("paste", function(e) {
                    e = e.originalEvent;
                    var cbd = e.clipboardData;
                    var ua = window.navigator.userAgent;

                    // 如果是 Safari 直接 return
                    if (!(e.clipboardData && e.clipboardData.items)) {
                        return;
                    }

                    // Mac平台下Chrome49版本以下 复制Finder中的文件的Bug Hack掉
                    if (cbd.items && cbd.items.length === 2 && cbd.items[0].kind === "string" && cbd.items[1].kind === "file" &&
                        cbd.types && cbd.types.length === 2 && cbd.types[0] === "text/plain" && cbd.types[1] === "Files" &&
                        ua.match(/Macintosh/i) && Number(ua.match(/Chrome\/(\d{2})/i)[1]) < 49) {
                        return;
                    }

                    for (var i = 0; i < cbd.items.length; i++) {
                        var item = cbd.items[i];
                        if (item.kind === "string" && item.type === "text/plain") {
                            item.getAsString(getCallBackStr);
                        }
                    }
                });

                $('#jsPanel-' + m).mouseleave(function() {
                    $scope.term[m].cursorOff();
                    $scope.term[m].unfocus();
                });

                $('#jsPanel-' + m).mouseenter(function() {
                    $scope.jp[m].front();
                    $scope.frontTmlId = m;
                    $scope.term[m].cursorOn();
                    $scope.term[m].focus();
                });

                $('#jsPanel-' + m).contextMenu('termRightMenu', {
                    bindings: {
                        'termPaste': function(t) {
                            pasteProcess($scope.term[m], $scope.pasteStr);
                        }
                    }
                });

                $(document).on('jspanelclosed', function(evnet, id) {
                    if (id === ('jsPanel-' + m)) {
                        console.log("close:" + m);
                        if (($scope.term[m]) && ($scope.term[m].closed === false)) {
                            $scope.term[m].closed = true;
                            $scope.term[m].clear();
                            //关闭websocket连接
                            if ($scope.wsList && $scope.wsList.length !== 0) {
                                var wsListCopy = [];
                                var wsObj;
                                var wsClose;

                                for (var k = 0; k < $scope.wsList.length; k++) {

                                    wsObj = {};
                                    if ($scope.wsList[k].nodeId !== m) {
                                        wsObj.nodeId = $scope.wsList[k].nodeId;
                                        wsObj.ws = $scope.wsList[k].ws;
                                        wsListCopy.push(wsObj);
                                    } else {
                                        wsClose = $scope.wsList[k].ws;
                                    }

                                }

                                $scope.wsList = wsListCopy;
                                if (wsClose) {
                                    wsClose.close();
                                }
                            }
                            $scope.term[m].close();
                        }
                    }
                });

                //窗口置前显示
                $(document).on('jspanelfronted', function(evnet, id) {
                    if (id === ('jsPanel-' + m)) {
                        console.log("front:" + m);
                        $scope.frontTmlId = m;
                        $scope.term[m].focus();
                    }
                });

                //改变窗口大小
                $('#jsPanel-' + m).resize(function() {
                    console.log('---change---');
                    var width = $(this).width();
                    var height = $(this).height();
                    //console.log('--->width:'+width);
                    //console.log('--->height:'+height);
                    var rows = Math.floor(height / 15);
                    var cols = Math.floor(width * 1.096 * 20 / 159) + 5;
                    //console.log('--->rows:'+rows);
                    //console.log('--->cols:'+cols);
                    var t = $scope.term[m];
                    t.conf.rows = t.maxLines = rows;
                    t.conf.cols = t.maxCols = cols;
                    t.rebuild();
                    t.focus();
                });
            }

            //终端每次粘贴的处理方法
            function pasteProcess(obj, line) {
                obj.write(line);
                obj.cursorOn(); //光标位置
                obj.cursorSet(obj.r, obj.c);
                $scope.lastR = obj.r;
                obj.lock = false;
            }

            //终端每次回车的处理方法
            function wsProcess(ws, obj, line) {
                ws.send(line);
                $scope.lastR = obj.r;
                console.log('terminal send:' + line);
                ws.onmessage = function(evt) {

                    console.log("receive:" + evt.data);
                    $scope.recData = evt.data;

                    var tmlId = obj.id;

                    if ($scope.recData && tmlId === $scope.frontTmlId) {
                        obj.cursorSet($scope.lastR, 0);
                        var text = $scope.recData.replace(/&nbsp;/g, ' ');
                        var len = text.length;

                        if (text.lastIndexOf("&nbsp;") !== -1 && text.substring(text.lastIndexOf("&nbsp;")) === '&nbsp;') {
                            text = text.substring(0, text.lastIndexOf("&nbsp;"));
                        }

                        var textArr = text.split('\n');

                        var allBr = true; //默认全为<br>
                        for (var i = 0; i < textArr.length; i++) {
                            if (textArr[i].length !== 0) {
                                allBr = false;
                                break;
                            }
                        }

                        if (allBr === true) {
                            textArr.pop();
                        }

                        for (var j = 0; j < textArr.length; j++) {
                            if (textArr[j].length === 0) {
                                textArr[j] = "\n";
                            } else { //过滤特殊字符
                                if (textArr[j].indexOf("\r") !== -1) { //从后台传过来的字符串末尾会多一个\r字符串
                                    textArr[j] = textArr[j].substring(0, textArr[j].length - 1);
                                }
                                textArr[j] = textArr[j].replace(/0m/g, 'm').replace(/01;31m/g, 'm');
                                textArr[j] = textArr[j].replace(/01;32m/g, 'm').replace(/01;33m/g, 'm').replace(/01;34m/g, 'm');
                                textArr[j] = textArr[j].replace(/01;35m/g, 'm').replace(/01;36m/g, 'm').replace(/01;37m/g, 'm');
                                textArr[j] = textArr[j].replace(/\[\m/g, '').replace(/\[\K/g, '').replace(/[\[\]]/g, '');

                                var strArr = [];
                                var special;
                                for (var k = 0; k < 17; k++) {
                                    special = String.fromCharCode(k);
                                    strArr = textArr[j].split(special);
                                    textArr[j] = strArr.join("");
                                }

                                special = String.fromCharCode(27);
                                strArr = textArr[j].split(special);
                                textArr[j] = strArr.join("");

                            }
                        }
                        obj.write(textArr);
                        obj.cursorOn();
                        obj.cursorSet(obj.r, obj.c + 1);
                        $scope.lastR = obj.r;
                        obj.lock = false;
                    }
                    $scope.conn = true; //已连接
                };
            }

            function termHandler() {
                var obj = this;
                obj.newLine(); //每次获取到输入 则转到下一行
                var line = obj.lineBuffer;
                if (line !== '') {
                    if (line === 'exit terminal') {
                        obj.clear();
                        if ($scope.wsList && $scope.wsList.length !== 0) {
                            var wsListCopy = [];
                            var wsObj;
                            var wsClose;

                            for (var k = 0; k < $scope.wsList.length; k++) {

                                wsObj = {};
                                if ($scope.wsList[k].nodeId !== $scope.m) {
                                    wsObj.nodeId = $scope.wsList[k].nodeId;
                                    wsObj.ws = $scope.wsList[k].ws;
                                    wsListCopy.push(wsObj);
                                } else {
                                    wsClose = $scope.wsList[k].ws;
                                }

                            }

                            $scope.wsList = wsListCopy;
                            if (wsClose) {
                                wsClose.close();
                            }
                        }
                        obj.close();
                        $scope.term[$scope.m].close();
                        return;
                    } else if ($scope.wsList) {
                        var len = line.length;
                        if (line[len - 1] === '\n') {
                            line = line.substring(0, len - 1);
                        }

                        var wss = $scope.wsList;
                        //关闭websocket连接
                        for (var w = 0; w < wss.length; w++) {
                            if (wss[w].nodeId === obj.id) {

                                var curWs = wss[w].ws;
                                wsProcess(curWs, obj, line);

                            }
                        }
                    }
                } else {
                    obj.prompt();
                }
            }


            function termChromeShow(n) {
                var div = 'terminal' + n;
                TermGlobals.setElementXY(div, 0, 0);
                var obj = $('#' + div);
                if (obj) {
                    obj.attr('class', 'termShow');
                }
            }


            function termExitHandler() {

                console.log("close:" + this.id);
                if (($scope.term[this.id]) && ($scope.term[this.id].closed === false)) {
                    $scope.term[this.id].closed = true;
                    if ($scope.jp[this.id]) {
                        $scope.jp[this.id].close();
                    }
                }

            }

            //terminal end

        };


        $scope.pwToggle = function() {
            $scope.pwIdF = "";
            $scope.pwUserLableF = "";
            $scope.physicalhide = "hehe";
            $scope.pwhide = "";
            $scope.bmap.hide = true;
            $scope.tunnelhide = "hehe";
            $scope.service.pwhide = "hehe";
            $scope.manager.managerhide = true;
            PwTopologySvc.getAllPw(function(data) {
                $scope.pwData = data;
            });
        };

        $scope.tunnelToggle = function() {
            $scope.tunnelIdF = "";
            $scope.tunnelNameF = "";
            $scope.physicalhide = "hehe";
            $scope.pwhide = "hehe";
            $scope.service.pwhide = "hehe";
            $scope.bmap.hide = true;
            $scope.manager.managerhide = true;
            $scope.tunnelhide = "";
            tunnelTopologySvc.getAllTunnel(function(data) {
                $scope.tunnelData = data;
            });
        };

        $rootScope.haha = function() {
            console.log("-----------------ha---ha-------------------");
        };

        //////////////////////////////////////////////////////////////
        $scope.service.topologyData = {};
        /*$scope.service.elineMoadl = {
            selectElineId : '',
            changeElineId: function(){},
            submitSelectElineId: function(){},
            elineIds: [],
            elineLink: {}
        };*/

        $scope.service.filter = function() {
            if (!$scope.label.split('/')[1]) {
                ServiceTopologySvc.getElineTopology(function(data, node, oSameNodeEline) {
                    data.filterSrc = $scope.service.sourceNode;
                    data.filterDes = $scope.service.destNode;
                    data.oSameNodeEline = oSameNodeEline;
                    $scope.service.topologyData = data;
                });
            }
        };

        $scope.applyList = function(cb) {
            if (!$rootScope.$$phase) {
                $scope.$apply(cb);
            }
        };

        $scope.service.toggle = function() {
            $scope.service.sourceNode = '';
            $scope.service.destNode = '';
            $scope.tunnelhide = "hehe";
            $scope.pwhide = "hehe";
            $scope.service.type = 'eline';
            $scope.physicalhide = "hehe";
            $scope.service.pwhide = "";

            $scope.flow.flowhide = true;
            $scope.manager.managerhide = true;
            $scope.label = "Eline";

            clearInterval(flowTopoTimer);
            flowTopoTimer = null;

            clearInterval(managerTopoTimer);
            managerTopoTimer = null;

            clearInterval(physicaTImer);
            physicaTImer = null;

            $scope.applyList(function() {
                $scope.label = "Eline";
            });

            ServiceTopologySvc.getElineTopology(function(data, node, oSameNodeEline) {
                data.oSameNodeEline = oSameNodeEline;
                $scope.service.topologyData = data;
            });
        };

        //bmap
        $scope.bmap.initBmap = function() {
            var Ids = [];
            var Lngs = [];
            var Lats = [];
            var Names = [];
            var User_Labels = [];
            var Parent_Topo_Ids = [];
            var Operate_Status = [];
            var NodeMap = [];
            var Links = [];
            $.get("maptopo/MapServlet", null, Callback);

            function Callback(data) {
                var obj = JSON.parse(data);

                if (obj["output"].nodes !== undefined) {
                    for (var i = 0; i < obj["output"]["nodes"].length; i++) {
                        if (obj["output"]["nodes"][i].id.indexOf("openflow") >= 0) {
                            Ids.push(obj["output"]["nodes"][i]["id"]);
                            Lngs.push(obj["output"]["nodes"][i]["longitude"]);
                            Lats.push(obj["output"]["nodes"][i]["latitude"]);
                            Names.push(obj["output"]["nodes"][i]["name"]);
                            User_Labels.push(obj["output"]["nodes"][i]["user-label"]);
                            Parent_Topo_Ids.push(obj["output"]["nodes"][i]["parent-topo-id"]);
                            Operate_Status.push(obj["output"]["nodes"][i]["operate-status"]);
                        }
                    }
                }


                var mapOptions = { mapType: BMAP_NORMAL_MAP };
                var map = new BMap.Map("bmapContainer", mapOptions); //设置卫星图为底图BMAP_PERSPECTIVE_MAP
                var initlng = 116.23;
                var initlat = 39.54;
                var initPoint = new BMap.Point(initlng, initlat); // 创建点坐标
                map.centerAndZoom(initPoint, 8); // 初始化地图,设置中心点坐标和地图级别。
                map.enableScrollWheelZoom(); // 启用滚轮放大缩小。
                map.enableKeyboard(); // 启用键盘操作。  
                map.enableContinuousZoom(); //启用连续缩放效果
                map.addControl(new BMap.NavigationControl()); //地图平移缩放控件
                map.addControl(new BMap.ScaleControl()); //显示比例尺在右下角

                for (var a = 0; a < Ids.length; a++) {
                    var point = new BMap.Point(Lngs[a], Lats[a]);
                    addMarker(point, Ids[a], Names[a], User_Labels[a], Parent_Topo_Ids[a], Operate_Status[a]);
                }

                if (obj["output"].link !== undefined) {
                    for (var j = 0; j < obj["output"]["link"].length; j++) {
                        if (obj["output"]["link"][j].id.indexOf("openflow") >= 0) {
                            var link = {};
                            link.right_node_id = obj["output"]["link"][j]["right-node-id"];
                            link.left_node_id = obj["output"]["link"][j]["left-node-id"];
                            link.marker1 = NodeMap[link.right_node_id];
                            link.marker2 = NodeMap[link.left_node_id];
                            link.left_ltp_id = obj["output"]["link"][j]["left-ltp-id"];
                            link.right_ltp_id = obj["output"]["link"][j]["right-ltp-id"];
                            link.operate_status = obj["output"]["link"][j]["operate-status"];
                            Links.push(link);
                        }
                    }

                    for (var b = 0; b < Links.length; b++) {
                        var buffer1 = Links[b].right_node_id + Links[b].left_node_id + Links[b].right_ltp_id + Links[b].left_ltp_id;
                        for (var c = b + 1; c < Links.length; c++) {
                            var buffer2 = Links[c].left_node_id + Links[c].right_node_id + Links[c].left_ltp_id + Links[c].right_ltp_id;
                            if (buffer1 == buffer2) {
                                Links[b].isDoubleLink = true;
                                Links.splice(c, 1);
                                break;
                            } else if (c == Links.length - 1) {
                                Links[b].isDoubleLink = false;
                            }
                        }
                    }

                    var NodeIDs = [];
                    for (var d = 0; d < Links.length; d++) {
                        var nodeId = {};
                        nodeId.right = Links[d].right_node_id;
                        nodeId.left = Links[d].left_node_id;
                        NodeIDs.push(nodeId);
                    }

                    for (var e = 0; e < NodeIDs.length; e++) {
                        var count = 0;
                        for (var f = 0; f < Links.length; f++) {
                            if ((Links[f].right_node_id == NodeIDs[e].right && Links[f].left_node_id == NodeIDs[e].left) || (Links[f].right_node_id == NodeIDs[e].left && Links[e].left_node_id == NodeIDs[e].right)) {
                                Links[f].radian = 0 + 30 * count;
                                count = count + 1;
                            }
                        }
                    }

                    for (var g = 0; g < Links.length; g++) {
                        addCurveLine(Links[g]);
                    }
                }

                //添加一个Marker
                function addMarker(point, id, name, user_label, parent_topo_id, operate_status) {
                    if (operate_status == "operate-up") {
                        operate_status = "在线";
                    } else if (operate_status == "operate-down") {
                        operate_status = "离线";
                    }
                    var simulatorIcon = new BMap.Icon("baidumapv2/images/simulator.png", new BMap.Size(32, 35));
                    // 创建标注对象并添加到地图
                    var content = "节点名称：" + name + "\n用户标识：" + user_label + "\n父级拓扑ID：" + parent_topo_id + "\n运行状态：" + operate_status;
                    var simulatorMarkerOptions = {
                        icon: simulatorIcon,
                        enableDragging: true,
                        //raiseOnDrag: true,      跳动
                        draggingCursor: "move",
                        title: content //map.openInfoWindow(new BMap.InfoWindow(content),point ) 
                    };
                    name += "";
                    var marker = new BMap.Marker(point, simulatorMarkerOptions);
                    var label = new window.BMap.Label(name, { offset: new window.BMap.Size(10 - 3 * (name.length - 1), 30), position: point });
                    label.setStyle({ backgroundColor: "0.05", color: "red", fontSize: "14px", border: "0", width: 7 * name.length + "px", height: "20px", textAlign: "center", lineHeight: "20px" });
                    marker.setLabel(label);

                    var markerMenu = new BMap.ContextMenu();
                    var txtMenuItem = [{ text: '添加设备', callback: function(p) { window.open('###'); } }, { text: '删除设备', callback: function(p) { alert("删除设备"); } }];
                    var opts = { width: 100 };
                    for (var i = 0; i < txtMenuItem.length; i++) {
                        markerMenu.addItem(new BMap.MenuItem(txtMenuItem[i].text, txtMenuItem[i].callback, opts));
                        markerMenu.addSeparator();
                    }
                    marker.addContextMenu(markerMenu);
                    map.addOverlay(marker);
                    NodeMap[id] = marker;
                    marker.addEventListener("dragend", function(e) {
                        var plng = e.point.lng;
                        var plat = e.point.lat;
                        $.post("maptopo/MapServlet", "node_id=" + id + "&&lng=" + plng + "&&lat=" + plat, null);
                    });
                    return marker;
                }

                //添加一条曲线
                function addCurveLine(link) {
                    var marker1 = link.marker1;
                    var marker2 = link.marker2;
                    var left_ltp_id = link.left_ltp_id;
                    var right_ltp_id = link.right_ltp_id;
                    var operate_status = link.operate_status;
                    if (operate_status == "operate-up") {
                        operate_status = "在线";
                    } else if (operate_status == "operate-down") {
                        operate_status = "离线";
                    }
                    var points = getRadian(link);
                    var polyline = new BMap.Polyline(points, { strokeColor: "green", strokeWeight: 3, strokeOpacity: 0.5 });
                    map.addOverlay(polyline);
                    var content = "左端口：" + left_ltp_id + "<br/>右端口：" + right_ltp_id + "<br/>运行状态：" + operate_status;
                    var label;
                    var fun = function(e) { map.openInfoWindow(new BMap.InfoWindow(content), e.point); };
                    polyline.addEventListener("mouseover", fun);
                    polyline.addEventListener("mouseout", function(e) { map.closeInfoWindow(); });
                    marker1.addEventListener("mouseover", function(e) { polyline.removeEventListener("mouseover", fun); });
                    marker1.addEventListener("mouseout", function(e) { polyline.addEventListener("mouseover", fun); });
                    marker2.addEventListener("mouseover", function(e) { polyline.removeEventListener("mouseover", fun); });
                    marker2.addEventListener("mouseout", function(e) { polyline.addEventListener("mouseover", fun); });
                    if (link.isDoubleLink) {
                        var arrow = addArrow(polyline, 10, Math.PI / 7, map);
                        var arrow2 = addArrow2(polyline, 10, Math.PI / 7, map);
                        marker1.addEventListener("dragging", function(e) {
                            points = getRadian(link);
                            polyline.setPath(points);
                            map.removeOverlay(arrow);
                            arrow = addArrow(polyline, 10, Math.PI / 7, map);
                            map.removeOverlay(arrow2);
                            arrow2 = addArrow2(polyline, 10, Math.PI / 7, map);
                        });
                        marker2.addEventListener("dragging", function(e) {
                            points = getRadian(link);
                            polyline.setPath(points);
                            map.removeOverlay(arrow);
                            arrow = addArrow(polyline, 10, Math.PI / 7, map);
                            map.removeOverlay(arrow2);
                            arrow2 = addArrow2(polyline, 10, Math.PI / 7, map);
                        });
                    } else {
                        var arrow_1 = addArrow(polyline, 10, Math.PI / 7, map);
                        marker1.addEventListener("dragging", function(e) {
                            points = getRadian(link);
                            polyline.setPath(points);
                            map.removeOverlay(arrow_1);
                            arrow_1 = addArrow(polyline, 10, Math.PI / 7, map);
                        });
                        marker2.addEventListener("dragging", function(e) {
                            points = getRadian(link);
                            polyline.setPath(points);
                            map.removeOverlay(arrow_1);
                            arrow_1 = addArrow(polyline, 10, Math.PI / 7, map);
                        });
                    }

                }
            }
        };

        $scope.bmap.toggle = function() {
            $scope.tunnelhide = "hehe";
            $scope.pwhide = "hehe";
            $scope.service.type = 'eline';
            $scope.physicalhide = "hehe";
            $scope.service.pwhide = true;
            $scope.bmap.hide = false;

            $scope.flow.flowhide = true;
            $scope.manager.managerhide = true;

            clearInterval(flowTopoTimer);
            flowTopoTimer = null;

            clearInterval(managerTopoTimer);
            managerTopoTimer = null;

            clearInterval(physicaTImer);
            physicaTImer = null;

            $scope.bmap.initBmap();
        };
    }]);
});
