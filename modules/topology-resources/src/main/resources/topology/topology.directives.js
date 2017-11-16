define(['app/topology/topology.module', 'app/topology/topology.services', 'vis'], function(topology, service, vis) {



    //
    //tunnel-topology
    //
    topology.register.directive('topologyTunnel', ['tunnelTopologySvc', function(tunnelTopologySvc) {
        // constants
        var width = 800,
            height = 800;

        return {
            restrict: 'EACM',
            scope: {
                tunnelData: '=',
                topologyData: '=',
                physicalhide: '=',
                tunnelhide: '='

            },
            link: function($scope, iElm, iAttrs, controller) {

                $scope.$watch('tunnelData', function(ntdata) {
                    if (ntdata) {
                        //   visinit(inNodes, inEdges, container, inOptions) {
                        var inNodes = $scope.tunnelData.nodes;
                        var inEdges = $scope.tunnelData.links;

                        var filterSrcNode = $scope.tunnelData.filterSrc;
                        var filterDesNode = $scope.tunnelData.filterDes;


                        var filterId = $scope.tunnelData.filterId;
                        var filterUserLabel = $scope.tunnelData.filterName;
                        if (filterId && filterId !== undefined) {
                            inNodes = inNodes.filter(function(item, index) {
                                return (item.tunnelid.indexOf(filterId)) >= 0;
                            });
                            if (inNodes) {
                                inEdges = inEdges.filter(function(item, index) {
                                    return (item.tunnelid.indexOf(filterId)) >= 0;
                                });
                            }
                        }

                        if (filterUserLabel && filterUserLabel !== undefined) {
                            inNodes = inNodes.filter(function(item, index) {
                                return (item.tunnelname.indexOf(filterUserLabel)) >= 0;
                            });
                            if (inNodes) {
                                inEdges = inEdges.filter(function(item, index) {
                                    return (item.tunnelname.indexOf(filterUserLabel)) >= 0;
                                });
                            }
                        }

                        if (filterSrcNode && filterSrcNode !== undefined && filterDesNode && filterDesNode !== undefined) {
                            var hehe = filterSrcNode + filterDesNode;
                            inEdges = inEdges.filter(function(item, index) {
                                return (item.sd.indexOf(hehe)) >= 0;
                            });
                            if (inEdges.length > 0) {
                                inNodes = inNodes.filter(function(item, index) {
                                    return (item.id.indexOf(filterSrcNode)) >= 0 || (item.id.indexOf(filterDesNode)) >= 0;
                                });
                            } else {
                                inNodes = [];
                            }
                        }

                        var container = iElm[0];

                        // legend moved to topology controller

                        var data = {
                            nodes: inNodes,
                            edges: inEdges
                        };

                        var
                            hl = '#0066FF',
                            hover = '#33CC33',
                            WHITE = '#eee',
                            BLACK = '#2B1B17';

                        var options = {
                            width: '100%',
                            height: '600px',
                            nodes: {
                                //widthMin: 20,
                                //widthMax: 64,
                                fontColor: BLACK
                            },
                            edges: {

                                color: {
                                    color: 'green',
                                    highlight: 'green',
                                    hover: hover
                                }
                            },
                            physics: {
                                barnesHut: {
                                    gravitationalConstant: -7025
                                }
                            },
                            hover: false,
                            groups: {
                                'switch': {
                                    shape: 'image',
                                    image: 'assets/images/Device_switch_3062_unknown_64.png'
                                },
                                'host': {
                                    shape: 'image',
                                    image: 'assets/images/Device_pc_3045_default_64.png'
                                }
                            },
                            /* keyboard:true,
                             tooltip: {
                                 delay: 300,
                                 fontColor: "black",
                                 fontSize: 14, // px
                                 fontFace: "Microsoft YaHei",
                                 color: {
                                     border: "#25a2dc",
                                     background: "#fcb546"
                                 }
                             }*/
                            //smoothCurves: false,
                            //stabilizationIterations: (inNodes.length > 30 ? inNodes.length * 10 : 1000),
                            //freezeForStabilization: true
                        };

                        var graph = new vis.Network(container, data, options);

                        graph.on('doubleClick', function(properties) {
                            console.log('doubleCilck clicked!');
                            var nodesinfo = JSON.stringify(properties.nodes);
                            var linksinfo = JSON.stringify(properties.edges);
                            console.log(nodesinfo);
                            console.log(linksinfo);

                            //link被双击
                            if (nodesinfo === "[]" && linksinfo !== "[]") {
                                console.log("link:" + JSON.stringify((properties.edges)[0]) + "被双击");
                                var linkinfo = (properties.edges)[0];
                                var tunnelId = linkinfo.split("-", 2)[0];
                                var lspId = linkinfo.split("-", 2)[1];

                                tunnelTopologySvc.getLspLinks(tunnelId, lspId, function(info) {

                                    $scope.physicalhide = "";
                                    $scope.tunnelhide = "hehe";
                                    $scope.topologyData = info;

                                    //$scope.tunnelData=info;
                                });

                            } //node被双击
                            else if (nodesinfo !== "[]" && linksinfo !== "[]") {

                            } else {

                            }
                        });

                        return graph;
                    }
                });

            }
        };
    }]);



    //
    //pw-topology
    //

    topology.register.directive('topologyPw', ['PwTopologySvc', function(PwTopologySvc) {
        // constants
        var width = 800,
            height = 800;

        return {
            restrict: 'EACM',
            scope: {
                pwData: '='

            },
            link: function($scope, iElm, iAttrs, controller) {

                $scope.$watch('pwData', function(ntdata) {
                    if (ntdata) {
                        //   visinit(inNodes, inEdges, container, inOptions) {
                        var inNodes = $scope.pwData.nodes;
                        var inEdges = $scope.pwData.links;

                        var filterId = $scope.pwData.filterId;
                        var filterUserLabel = $scope.pwData.filterLabel;
                        var filterSrcNode = $scope.pwData.filterSrc;
                        var filterDesNode = $scope.pwData.filterDes;

                        if (filterId && filterId !== undefined) {
                            inNodes = inNodes.filter(function(item, index) {
                                return (item.pwid.indexOf(filterId)) >= 0;
                            });
                            if (inNodes) {
                                inEdges = inEdges.filter(function(item, index) {
                                    return (item.id.indexOf(filterId)) >= 0;
                                });
                            }
                        }

                        if (filterUserLabel && filterUserLabel !== undefined) {
                            inNodes = inNodes.filter(function(item, index) {
                                return (item.userlabel.indexOf(filterUserLabel)) >= 0;
                            });
                            if (inNodes) {
                                inEdges = inEdges.filter(function(item, index) {
                                    return (item.userlabel.indexOf(filterUserLabel)) >= 0;
                                });
                            }
                        }

                        if (filterSrcNode && filterSrcNode !== undefined && filterDesNode && filterDesNode !== undefined) {
                            var hehe = filterSrcNode + filterDesNode;
                            inEdges = inEdges.filter(function(item, index) {
                                return (item.sd.indexOf(hehe)) >= 0;
                            });
                            if (inEdges.length > 0) {
                                inNodes = inNodes.filter(function(item, index) {
                                    return (item.id.indexOf(filterSrcNode)) >= 0 || (item.id.indexOf(filterDesNode)) >= 0;
                                });
                            } else {
                                inNodes = [];
                            }
                        }

                        var container = iElm[0];

                        // legend moved to topology controller

                        var data = {
                            nodes: inNodes,
                            edges: inEdges
                        };

                        var
                            hl = '#0066FF',
                            hover = '#33CC33',
                            WHITE = '#eee',
                            BLACK = '#2B1B17';

                        var options = {
                            width: '100%',
                            height: '600px',
                            nodes: {
                                //widthMin: 20,
                                //widthMax: 64,
                                fontColor: BLACK
                            },
                            edges: {
                                length: 80,
                                color: {
                                    color: 'green',
                                    highlight: 'green',
                                    hover: hover
                                }
                            },
                            physics: {
                                barnesHut: {
                                    gravitationalConstant: -7025
                                }
                            },
                            hover: false,
                            groups: {
                                'switch': {
                                    shape: 'image',
                                    image: 'assets/images/Device_switch_3062_unknown_64.png'
                                },
                                'host': {
                                    shape: 'image',
                                    image: 'assets/images/Device_pc_3045_default_64.png'
                                }
                            },
                            /*keyboard:true,
                            tooltip: {
                                delay: 300,
                                fontColor: "black",
                                fontSize: 14, // px
                                fontFace: "Microsoft YaHei",
                                color: {
                                    border: "#25a2dc",
                                    background: "#fcb546"
                                }
                            }*/
                            //smoothCurves: false,
                            //stabilizationIterations: (inNodes.length > 30 ? inNodes.length * 10 : 1000),
                            //freezeForStabilization: true
                        };

                        var graph = new vis.Network(container, data, options);

                        graph.on('doubleClick', function(properties) {
                            console.log('doubleCilck clicked!');
                            var nodesinfo = JSON.stringify(properties.nodes);
                            var linksinfo = JSON.stringify(properties.edges);
                            console.log(nodesinfo);
                            console.log(linksinfo);

                            //link被双击
                            if (nodesinfo === "[]" && linksinfo !== "[]") {
                                //        console.log("link:"+JSON.stringify((properties.edges)[0])+"被双击"); 
                                //        PwTopologySvc.getPwInfo((properties.edges)[0],function(info){
                                //          $('#myModalLabel').html('<h5>pw information</h5>');         
                                //          $('.modal-body').html(info);
                                //        $('#myModal').modal('show');
                                //    });     

                            } //node被双击
                            else if (nodesinfo !== "[]" && linksinfo !== "[]") {
                                //  console.log("node"+nodesinfo+"被双击");  
                                //  var nodeinfo=(properties.nodes)[0];
                                //  var pwid=nodeinfo.split("-",2)[0];
                                //  PwTopologySvc.getPwInfo(pwid,function(info){
                                //  $('#myModalLabel').html('<h5>pw information</h5>');         
                                //    $('.modal-body').html(info);
                                //  
                                //    $('#myModal').modal('show');$('#deleteB').show();
                                //  });     

                            } else {

                            }
                        });





                        return graph;
                    }
                });

            }
        };
    }]);



    //
    //topologySimple
    //
    topology.register.directive('topologySimple', ['SptnTopologySvc', '$state', '$rootScope', '$filter', function(SptnTopologySvc, $state, $rootScope, $filter) {
        // constants
        var width = 800,
            height = 900;


        return {
            restrict: 'EACM',
            scope: {
                topologyData: '='
            },
            link: function($scope, iElm, iAttrs, controller) {
                var zh = {
                    Name: $filter('translate')('Name'),
                    ParentID: '父级拓扑ID',
                    UserLabel: '用户标识',
                    Status: '运行状态',
                    Cancel: '取消',
                    Save: '保存',
                    ParentTopoID: $filter('translate')('Parent Topo Id'),
                    AdminStatus: $filter('translate')('Admin Status'),
                    OperateStatus: $filter('translate')('Operate Status'),
                    LeftNode: $filter('translate')('Left Node'),
                    RightNode: $filter('translate')('Right Node'),
                    LeftLtp: $filter('translate')('Left LTP'),
                    RightLtp: $filter('translate')('Right LTP'),
                    LeftLtpMac: $filter('translate')('Left Ltp Mac'),
                    RightLtpMac: $filter('translate')('Right Ltp Mac')
                };

                function showNodeInfoWin(data) {
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
                        items: [
                            { xtype: 'textfield', fieldLabel: 'ID', readOnly: true, name: 'id', hidden: true },
                            { xtype: 'textfield', fieldLabel: zh.Name, readOnly: true, name: 'name' },
                            { xtype: 'textfield', fieldLabel: zh.ParentID, readOnly: true, name: 'parent-topo-id' },
                            { xtype: 'textfield', fieldLabel: zh.UserLabel, readOnly: false, name: 'user-label', allowBlank: false },
                            { xtype: 'textfield', fieldLabel: zh.Status, readOnly: true, name: 'operate-status' }
                        ],
                        buttons: [{
                            text: zh.Cancel,
                            iconCls: 'x-fa fa-remove',
                            handler: function() {
                                this.up('window').close();
                            }
                        }, {
                            text: zh.Save,
                            iconCls: 'x-fa fa-save',
                            handler: function() {
                                var win = this.up('window');
                                var form = this.up('form').getForm();

                                if (form.isValid()) {
                                    var input = {
                                        'node-id': form.getValues()['id'],
                                        'userlabel': form.getValues()['user-label']
                                    };
                                    SptnTopologySvc.updateNodeUserLabelById(input, function(data) {
                                        if (data == 'success') {
                                            win.destroy();
                                            $state.reload();
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
                        height: 300,
                        minWidth: 500,
                        minHeight: 300,
                        resizable: true,
                        modal: true,
                        items: form
                    });

                    form.getForm().setValues(data);
                    win.show();
                }

                function showLinkInfoWin(data) {
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
                        items: [
                            { xtype: 'textfield', fieldLabel: 'ID', readOnly: true, name: 'id', hidden: true },
                            { xtype: 'textfield', fieldLabel: zh.Name, readOnly: true, name: 'name' },
                            { xtype: 'textfield', fieldLabel: zh.ParentTopoID, readOnly: true, name: 'parent-topo-id' },
                            { xtype: 'textfield', fieldLabel: zh.AdminStatus, readOnly: true, name: 'admin-status' },
                            { xtype: 'textfield', fieldLabel: zh.OperateStatus, readOnly: true, name: 'operate-status' },
                            { xtype: 'textfield', fieldLabel: zh.LeftNode, readOnly: true, name: 'left-node-name' },
                            { xtype: 'textfield', fieldLabel: zh.RightNode, readOnly: true, name: 'right-node-name' },
                            { xtype: 'textfield', fieldLabel: zh.LeftLtp, readOnly: true, name: 'left-ltp-name' },
                            { xtype: 'textfield', fieldLabel: zh.RightLtp, readOnly: true, name: 'right-ltp-name' },
                            { xtype: 'textfield', fieldLabel: zh.LeftLtpMac, readOnly: true, name: 'left-ltp-mac' },
                            { xtype: 'textfield', fieldLabel: zh.RightLtpMac, readOnly: true, name: 'right-ltp-mac' },
                            { xtype: 'textfield', fieldLabel: '', readOnly: true, name: 'operate-status' },
                            { xtype: 'textfield', fieldLabel: 'Status', readOnly: true, name: 'operate-status' },
                            { xtype: 'textfield', fieldLabel: 'Status', readOnly: true, name: 'operate-status' }
                        ],
                        buttons: [{
                            text: 'Cancel',
                            iconCls: 'x-fa fa-remove',
                            handler: function() {
                                this.up('window').close();
                            }
                        }, {
                            text: 'Save',
                            iconCls: 'x-fa fa-save',
                            handler: function() {
                                var win = this.up('window');
                                var form = this.up('form').getForm();

                                if (form.isValid()) {
                                    var input = {
                                        'node-id': form.getValues()['id'],
                                        'userlabel': form.getValues()['user-label']
                                    };
                                    SptnTopologySvc.updateNodeUserLabelById(input, function(data) {
                                        if (data == 'success') {
                                            win.destroy();
                                            $state.reload();
                                        }
                                    });
                                }
                            }
                        }]
                    });
                    var win = Ext.widget('window', {
                        title: "Node Info",
                        border: false,
                        layout: 'fit',
                        width: 500,
                        height: 450,
                        minWidth: 500,
                        minHeight: 450,
                        resizable: true,
                        modal: true,
                        items: form
                    });

                    form.getForm().setValues(data);
                    win.show();
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

                function getExtNodeIpById(nodeId) {
                    var nIp;
                    SptnTopologySvc.getExtNodeIpById(nodeId, function(data) {
                        nIp = data;
                    });
                    return nIp;
                }

                function getNodeIpById(nodeId) {
                    var nIp;
                    SptnTopologySvc.getNodeIpById(nodeId, function(data) {
                        nIp = data;
                    });
                    if (nIp === undefined) {
                        nIp = getExtNodeIpById(nodeId);
                    }
                    return nIp;
                }

                $scope.$watch('topologyData', function(ntdata) {
                    function filterTopology(data) {
                        var inNodes = data.nodes;
                        var inEdges = data.edges;
                        var filterUserLabel = ntdata.filterLabel;
                        var filterName = ntdata.filterName;

                        if (filterName && filterName !== undefined) {
                            inNodes = inNodes.filter(function(item, index) {
                                if (item.name) {
                                    return (item.name.indexOf(filterName)) >= 0;
                                } else {
                                    return false;
                                }
                            });
                            if (inNodes) {
                                var allid = "";
                                angular.forEach(inNodes, function(nodeData) {
                                    allid += nodeData.id;
                                });

                                if (inEdges) {
                                    inEdges = inEdges.filter(function(item, index) {
                                        return ((allid.indexOf(item.from)) >= 0) && ((allid.indexOf(item.to)) >= 0);
                                    });
                                }
                            }
                        }

                        if (filterUserLabel && filterUserLabel !== undefined) {
                            inNodes = inNodes.filter(function(item, index) {
                                if (item.userlabel) {
                                    return (item.userlabel.indexOf(filterUserLabel)) >= 0;
                                } else {
                                    return false;
                                }
                            });
                            if (inNodes) {
                                var allid1 = "";
                                angular.forEach(inNodes, function(nodeData) {
                                    allid1 += nodeData.id;
                                });
                                if (inEdges) {
                                    inEdges = inEdges.filter(function(item, index) {
                                        return ((allid1.indexOf(item.from)) >= 0) && ((allid1.indexOf(item.to)) >= 0);
                                    });
                                }
                            }
                        }

                        var data_filter = {
                            nodes: inNodes,
                            edges: inEdges
                        };

                        return data_filter;
                    }

                    if (ntdata) {
                        var container = iElm[0];

                        var
                            hl = '#0066FF',
                            hover = '#33CC33',
                            WHITE = '#eee',
                            BLACK = '#2B1B17';

                        var options = {
                            width: '100%',
                            height: '600px',
                            nodes: {
                                color: {
                                    background: BLACK
                                }
                            },
                            edges: {
                                //length: 60,
                                width: 3,
                                smooth: {
                                    enabled: true,
                                    type: "curvedCCW",
                                    roundness: 0.05
                                }
                            },
                            physics: {
                                barnesHut: {
                                    gravitationalConstant: 0,
                                    springConstant: 0,
                                    centralGravity: 0
                                }
                            },
                            layout: {
                                randomSeed: 2
                            },
                            groups: {
                                'node-up': {
                                    shape: 'image',
                                    image: 'assets/images/node-up.png'
                                },
                                'node-down': {
                                    shape: 'image',
                                    image: 'assets/images/node-down.png'
                                },
                                'node-lost': {
                                    shape: 'image',
                                    image: 'assets/images/node-lost.png'
                                },
                                'node-unkown': {
                                    shape: 'image',
                                    image: 'assets/images/node-un.png'
                                },
                                'extnode-up': {
                                    shape: 'image',
                                    image: 'assets/images/ext-up.png'
                                },
                                'extnode-down': {
                                    shape: 'image',
                                    image: 'assets/images/ext-down.png'
                                },
                                'extnode-lost': {
                                    shape: 'image',
                                    image: 'assets/images/ext-lost.png'
                                },
                                'extnode-unkown': {
                                    shape: 'image',
                                    image: 'assets/images/ext-un.png'
                                },
                                'cloud': {
                                    shape: 'image',
                                    image: 'assets/images/clouds.png'
                                }
                            },
                            interaction: {
                                navigationButtons: true,
                                keyboard: false
                            }
                        };

                        var extPrtTopoIdStr = ntdata.extPrtTopoIdStr;

                        var graph = new vis.Network(container, {
                            nodes: [],
                            edges: []
                        }, options);

                        var data = ntdata.data;

                        var singleExtNodes = ntdata.singleExtNodes;

                        var allNodesPosObj;

                        $rootScope.firstConn = {};
                        if (data && data.nodes) {
                            for (var p = 0; p < data.nodes.length; p++) {
                                var nId = data.nodes[p].id;
                                $rootScope.firstConn[nId] = true;
                            }
                        }

                        graph.on('oncontext', function(params) {
                            var x = params.pointer.DOM.x;
                            var y = params.pointer.DOM.y;

                            var nodeid = graph.getNodeAt({ 'x': x, 'y': y });

                            if (nodeid !== undefined) {
                                $('#topoSimple').contextMenu('topoDataLinkMenu', {
                                    bindings: {
                                        'Inventory': function(t) {
                                            SptnTopologySvc.getNodeInfo(nodeid, function(info) {
                                                if (info != 'error') {
                                                    $state.go('main.inventory.index', { 'nodeIP': info['ip'] });
                                                }
                                            });
                                        },
                                        'Alarm': function(t) {},
                                        'PM': function(t) {},
                                        'Log': function(t) {},
                                        'Save Topology': function(t) {},
                                        'SSH': function(t) { //t.id = mynetwork
                                            $(':input', '#topoConnForm').not(':button, :submit, :reset, :hidden').val(''); //清空表单
                                            console.log('Trigger was ' + nodeid + '\nAction was SSH'); //
                                            $('#simpleTopoTitle').html($filter('translate')('SSH Configuration Management') + ' | ' + getNodeUserLabelById(nodeid));
                                            $('#topoconn-protocal').val('SSH');
                                            $rootScope.protocal = 'ssh';
                                            $('#topoconn-port').val('22');
                                            var nodeIp = getNodeIpById(nodeid);
                                            $('#topoconn-ip').val(nodeIp);
                                            $rootScope.rClickNodeId = nodeid;

                                            //获取连接参数信息
                                            SptnTopologySvc.getNodeConnInfo('ssh', nodeid, function(connInfo) {
                                                if ($rootScope.firstConn[nodeid] === false) {
                                                    if (connInfo && $rootScope.connFlag[nodeid] === true) {
                                                        $('#topoconn-ip').val(connInfo.ip);
                                                        $('#topoconn-port').val(connInfo.port);
                                                        $('#topoconn-username').val(connInfo.name);
                                                        $('#topoconn-pwd').val(connInfo.pwd);
                                                    }
                                                } else {
                                                    $rootScope.firstConn[nodeid] = false;
                                                }
                                            });
                                            //获取连接参数信息

                                            $('#topoConnModal').modal('show');
                                            TermGlobals.activeTerm = null; //将活动终端置为空
                                            $('#topoConnForm').focus();

                                        },
                                        'Telnet': function(t) {
                                            $(':input', '#topoConnForm').not(':button, :submit, :reset, :hidden').val(''); //清空表单
                                            console.log('Trigger was ' + nodeid + '\nAction was Telnet');
                                            $('#simpleTopoTitle').html($filter('translate')('Telnet Configuration Management') + ' | ' + getNodeUserLabelById(nodeid));
                                            $('#topoconn-protocal').val('Telnet');
                                            $rootScope.protocal = 'telnet';
                                            $('#topoconn-port').val('23');
                                            var nodeIp = getNodeIpById(nodeid);
                                            $('#topoconn-ip').val(nodeIp);
                                            $rootScope.rClickNodeId = nodeid;

                                            //获取连接参数信息
                                            SptnTopologySvc.getNodeConnInfo('telnet', nodeid, function(connInfo) {
                                                if ($rootScope.firstConn[nodeid] === false) {
                                                    if (connInfo && $rootScope.connFlag[nodeid] === true) {
                                                        $('#topoconn-ip').val(connInfo.ip);
                                                        $('#topoconn-port').val(connInfo.port);
                                                        $('#topoconn-username').val(connInfo.name);
                                                        $('#topoconn-pwd').val(connInfo.pwd);
                                                    }
                                                } else {
                                                    $rootScope.firstConn[nodeid] = false;
                                                }
                                            });
                                            //获取连接参数信息

                                            $('#topoConnModal').modal('show');
                                            TermGlobals.activeTerm = null; //将活动终端置为空
                                            $('#topoConnForm').focus();
                                        }
                                    }
                                });
                            } else {
                                $('#topoSimple').contextMenu('topoDataLinkMenuClean', {
                                    onContextMenu: function(e) {
                                        return true;
                                    }
                                });
                            }
                        });

                        if (extPrtTopoIdStr === undefined) {
                            var inNodes = ntdata.nodes;
                            var inEdges = ntdata.links;

                            // var filterId = ntdata.filterId;
                            // var filterUserLabel = ntdata.filterLabel;
                            // var filterName = ntdata.filterName;
                            // var filterStatus = ntdata.filterStatus;
                            // if(filterId && filterId !== undefined){
                            //     inNodes = inNodes.filter(function(item, index) {
                            //     return (item.id.indexOf(filterId))>=0;
                            //   });
                            //     if(inNodes){
                            //         inEdges = inEdges.filter(function(item, index) {
                            //             return ((item.from.indexOf(filterId))>=0)&&((item.to.indexOf(filterId))>=0);
                            //         });
                            //     }
                            // }                   
                            // if(filterStatus && filterStatus !== undefined){
                            //     inNodes = inNodes.filter(function(item, index) {
                            //     return (item.status.indexOf(filterStatus))>=0;
                            //   });
                            //     if(inNodes){

                            //         var allidd = "";
                            //         angular.forEach(inNodes, function(nodeData) {
                            //             allidd += nodeData.id;
                            //         });
                            //         inEdges = inEdges.filter(function(item, index) {

                            //         return ((allidd.indexOf(item.from))>=0)&&((allidd.indexOf(item.to))>=0);

                            //         });
                            //     }
                            // }

                            data = {
                                nodes: inNodes,
                                edges: inEdges
                            };

                            var dataFilter = filterTopology(data);

                            graph.setData(dataFilter);

                            allNodesPosObj = graph.getPositions();
                            for (var nodeId0 in allNodesPosObj) {
                                if (nodeId0.indexOf("openflow") !== -1) {
                                    SptnTopologySvc.updateNodePosById(nodeId0, allNodesPosObj[nodeId0].x, allNodesPosObj[nodeId0].y);
                                }
                            }
                            graph.on('doubleClick', function(properties) {
                                var nodeId = properties.nodes[0];
                                var linkId = properties.edges[0];
                                if (nodeId !== undefined) {
                                    SptnTopologySvc.getNodeInfo(nodeId, function(info) {
                                        showNodeInfoWin(info);
                                    });
                                } else if (linkId !== undefined) {
                                    SptnTopologySvc.getLinkInfo(linkId, function(info) {
                                        $('#topoNodeBtn').hide();
                                        $('#topoDetailBody').html(info);
                                        $('#topoDetail').modal('show');
                                        $('#detailimg').attr('src', 'assets/images/linkmodaltitle.gif');
                                    });
                                }
                            });
                            graph.on('dragEnd', function(properties) {
                                var nodeId = properties.nodes[0];
                                if (nodeId !== undefined) {
                                    var nodePosObj = graph.getPositions([nodeId]);
                                    SptnTopologySvc.updateNodePosById(nodeId, nodePosObj[nodeId].x, nodePosObj[nodeId].y);
                                }
                            });
                        } else {
                            if (extPrtTopoIdStr === "") { //没有外部节点
                                var dataFilter_1 = filterTopology(data);
                                graph.setData(dataFilter_1);

                                allNodesPosObj = graph.getPositions();
                                for (var nodeId1 in allNodesPosObj) {
                                    if (nodeId1.indexOf("openflow") !== -1) {
                                        SptnTopologySvc.updateNodePosById(nodeId1, allNodesPosObj[nodeId1].x, allNodesPosObj[nodeId1].y);
                                    }
                                }
                                graph.on('doubleClick', function(properties) {
                                    var nodeId = properties.nodes[0];
                                    var linkId = properties.edges[0];
                                    if (nodeId !== undefined) {
                                        SptnTopologySvc.getNodeInfo(nodeId, function(info) {
                                            showNodeInfoWin(info);
                                        });
                                    } else if (linkId !== undefined) {
                                        SptnTopologySvc.getLinkInfo(linkId, function(info) {
                                            $('#topoNodeBtn').hide();
                                            $('#topoDetailBody').html(info);
                                            $('#topoDetail').modal('show');
                                            $('#detailimg').attr('src', 'assets/images/linkmodaltitle.gif');
                                        });
                                    }
                                });
                                graph.on('dragEnd', function(properties) {
                                    var nodeId = properties.nodes[0];
                                    if (nodeId !== undefined) {
                                        var nodePosObj = graph.getPositions([nodeId]);
                                        SptnTopologySvc.updateNodePosById(nodeId, nodePosObj[nodeId].x, nodePosObj[nodeId].y);
                                    }
                                });
                            } else { //有外部节点
                                if (data !== undefined) { //没有外部链路
                                    var dataFilter_2 = filterTopology(data);
                                    graph.setData(dataFilter_2);

                                    allNodesPosObj = graph.getPositions();
                                    for (var nodeId2 in allNodesPosObj) {
                                        if (nodeId2.indexOf("openflow") !== -1) {
                                            SptnTopologySvc.updateNodePosById(nodeId2, allNodesPosObj[nodeId2].x, allNodesPosObj[nodeId2].y);
                                        }
                                    }
                                    graph.on('doubleClick', function(properties) {
                                        var nodeId = properties.nodes[0];
                                        var linkId = properties.edges[0];
                                        if (nodeId !== undefined) {
                                            SptnTopologySvc.getNodeInfo(nodeId, function(info) {
                                                showNodeInfoWin(info);
                                            });
                                        } else if (linkId !== undefined) {
                                            SptnTopologySvc.getLinkInfo(linkId, function(info) {
                                                $('#topoNodeBtn').hide();
                                                $('#topoDetailBody').html(info);
                                                $('#topoDetail').modal('show');
                                                $('#detailimg').attr('src', 'assets/images/linkmodaltitle.gif');
                                            });
                                        }
                                    });
                                    graph.on('dragEnd', function(properties) {
                                        var nodeId = properties.nodes[0];
                                        if (nodeId !== undefined) {
                                            var nodePosObj = graph.getPositions([nodeId]);
                                            SptnTopologySvc.updateNodePosById(nodeId, nodePosObj[nodeId].x, nodePosObj[nodeId].y);
                                            //$state.reload();
                                        }
                                    });
                                } else { //有外部链路
                                    var extPrtTopoIdList = extPrtTopoIdStr.split(";");
                                    var nodes0 = ntdata.nodes0;

                                    var nodes1 = ntdata.nodes1;
                                    var nodes2 = ntdata.nodes2;

                                    var links0 = ntdata.links0;
                                    var links1 = ntdata.links1;
                                    var links2 = ntdata.links2;

                                    var extLinks1 = ntdata.extLinks1;
                                    var extLinks2 = ntdata.extLinks2;

                                    if (singleExtNodes !== "") { //如果存在孤立的外部节点

                                        extPrtTopoIdStr = "";
                                        if (links2 !== undefined) {
                                            for (var extPrtTopoId2 in links2) {
                                                extPrtTopoIdStr = extPrtTopoIdStr + extPrtTopoId2 + ";";
                                            }
                                        }

                                        if (singleExtNodes) {
                                            nodes0 = nodes0.concat(singleExtNodes);
                                        }
                                    }

                                    var flag = {};
                                    var nodesData = [];
                                    var linksData = [];

                                    if (nodes0) {
                                        nodesData = nodesData.concat(nodes0);
                                    }

                                    if (links0) {
                                        linksData = linksData.concat(links0);
                                    }

                                    var extPrtTopoIds = [];

                                    if (extPrtTopoIdStr !== "") {
                                        extPrtTopoIdList = extPrtTopoIdStr.split(";");

                                        for (var i = 0; i < extPrtTopoIdList.length - 1; i++) {
                                            var extPrtTopoId = extPrtTopoIdList[i];
                                            flag[extPrtTopoId] = true;
                                            if (nodes1[extPrtTopoId] !== undefined) {
                                                nodesData = nodesData.concat(nodes1[extPrtTopoId]);
                                            }
                                            if (links1[extPrtTopoId] !== undefined) {
                                                linksData = linksData.concat(links1[extPrtTopoId]);
                                            }

                                            extPrtTopoIds.push(extPrtTopoId);
                                        }
                                    }


                                    var data0 = {
                                        nodes: nodesData,
                                        edges: linksData
                                    };

                                    var dataFilter_3 = filterTopology(data0);
                                    graph.setData(dataFilter_3);

                                    allNodesPosObj = graph.getPositions();
                                    for (var nodeId3 in allNodesPosObj) {
                                        if (nodeId3.indexOf("openflow") !== -1) {
                                            SptnTopologySvc.updateNodePosById(nodeId3, allNodesPosObj[nodeId3].x, allNodesPosObj[nodeId3].y);
                                        }
                                    }

                                    //绑定双击事件
                                    graph.on('doubleClick', function(properties) {

                                        var linksData = [];
                                        if (links0) {
                                            linksData = linksData.concat(links0);
                                        }

                                        var nodesData = [];
                                        if (nodes0) {
                                            nodesData = nodesData.concat(nodes0);
                                        }

                                        var nodeId = properties.nodes[0];
                                        var linkId = properties.edges[0];
                                        //如果双击的是节点
                                        if (nodeId !== undefined) {
                                            if (nodeId.indexOf("cloud:") !== -1) {
                                                nodeId = nodeId.substring("cloud:".length);
                                                //如果双击的节点是云节点 不是云节点不做任何操作
                                                if (extPrtTopoIdStr.indexOf(nodeId) !== -1) {

                                                    angular.forEach(extPrtTopoIds, function(extPrtTopoId) {
                                                        if (extPrtTopoId === nodeId) {
                                                            if (flag[nodeId] === true) {
                                                                if (nodes2[nodeId]) {
                                                                    nodesData = nodesData.concat(nodes2[nodeId]);
                                                                }

                                                                if (extLinks2[nodeId]) {
                                                                    linksData = linksData.concat(extLinks2[nodeId]);
                                                                }

                                                                if (links2[nodeId]) {
                                                                    linksData = linksData.concat(links2[nodeId]);
                                                                }
                                                            } else {
                                                                if (nodes1[nodeId]) {
                                                                    nodesData = nodesData.concat(nodes1[nodeId]);
                                                                }

                                                                if (extLinks1[nodeId]) {
                                                                    linksData = linksData.concat(extLinks1[nodeId]);
                                                                }

                                                                if (links1[nodeId]) {
                                                                    linksData = linksData.concat(links1[nodeId]);
                                                                }
                                                            }
                                                            flag[nodeId] = !flag[nodeId];
                                                        } else {
                                                            if (flag[extPrtTopoId] === false) {
                                                                if (nodes2[extPrtTopoId]) {
                                                                    nodesData = nodesData.concat(nodes2[extPrtTopoId]);
                                                                }

                                                                if (extLinks2[extPrtTopoId]) {
                                                                    linksData = linksData.concat(extLinks2[extPrtTopoId]);
                                                                }

                                                                if (links2[extPrtTopoId]) {
                                                                    linksData = linksData.concat(links2[extPrtTopoId]);
                                                                }
                                                            } else {
                                                                if (nodes1[extPrtTopoId]) {
                                                                    nodesData = nodesData.concat(nodes1[extPrtTopoId]);
                                                                }
                                                                if (extLinks1[extPrtTopoId]) {
                                                                    linksData = linksData.concat(extLinks1[extPrtTopoId]);
                                                                }
                                                                if (links1[extPrtTopoId]) {
                                                                    linksData = linksData.concat(links1[extPrtTopoId]);
                                                                }
                                                            }
                                                        }
                                                    });

                                                    var data = {
                                                        nodes: nodesData,
                                                        edges: linksData
                                                    };

                                                    graph.setData(data);

                                                }
                                            } else if (nodeId.indexOf("cloud:") === -1) {
                                                SptnTopologySvc.getNodeInfo(nodeId, function(info) {
                                                    showNodeInfoWin(info);
                                                });
                                            }
                                        } else if (linkId !== undefined) { //如果双击的是链路
                                            SptnTopologySvc.getLinkInfo(linkId, function(info) {
                                                $('#topoNodeBtn').hide();
                                                $('#topoDetailBody').html(info);
                                                $('#topoDetail').modal('show');
                                                $('#detailimg').attr('src', 'assets/images/linkmodaltitle.gif');
                                            });
                                        }

                                    });
                                    graph.on('dragEnd', function(properties) {

                                        var linksData = [];
                                        if (links0) {
                                            linksData = linksData.concat(links0);
                                        }

                                        var nodesData = [];
                                        if (nodes0) {
                                            nodesData = nodesData.concat(nodes0);
                                        }

                                        var nodeId = properties.nodes[0];
                                        if (nodeId !== undefined) {
                                            var nodePosObj = graph.getPositions([nodeId]);
                                            if (nodeId.indexOf("cloud:") === -1) { //不是云节点
                                                SptnTopologySvc.updateNodePosById(nodeId, nodePosObj[nodeId].x, nodePosObj[nodeId].y);

                                                var dNodesData = data0.nodes;

                                                for (var a = 0; a < dNodesData.length; a++) {
                                                    if (dNodesData[a].id === nodeId) {
                                                        dNodesData[a].x = nodePosObj[nodeId].x;
                                                        dNodesData[a].y = nodePosObj[nodeId].y;
                                                    }
                                                }

                                                var allNodesInView = graph.getPositions();
                                                for (var aNodeId in allNodesInView) {

                                                    if (aNodeId.indexOf("cloud:") !== -1 && flag[aNodeId.substring("cloud:".length)] !== undefined) {
                                                        var acNodeId = aNodeId.substring("cloud:".length);
                                                        if (acNodeId !== undefined) {
                                                            if (flag[acNodeId] === false) {
                                                                for (var c = 0; c < nodes2[acNodeId].length; c++) {
                                                                    if (nodes2[acNodeId][c].id === nodeId) {
                                                                        nodes2[acNodeId][c].x = nodePosObj[nodeId].x;
                                                                        nodes2[acNodeId][c].y = nodePosObj[nodeId].y;
                                                                    }
                                                                }

                                                                if (nodes2[acNodeId]) {
                                                                    nodesData = nodesData.concat(nodes2[acNodeId]);
                                                                }

                                                                if (extLinks2[acNodeId]) {
                                                                    linksData = linksData.concat(extLinks2[acNodeId]);
                                                                }

                                                                if (links2[acNodeId]) {
                                                                    linksData = linksData.concat(links2[acNodeId]);
                                                                }
                                                            } else {
                                                                if (nodes1[acNodeId]) {
                                                                    nodesData = nodesData.concat(nodes1[acNodeId]);
                                                                }

                                                                if (extLinks1[acNodeId]) {
                                                                    linksData = linksData.concat(extLinks1[acNodeId]);
                                                                }

                                                                if (links1[acNodeId]) {
                                                                    linksData = linksData.concat(links1[acNodeId]);
                                                                }
                                                            }
                                                        }

                                                    }

                                                }

                                                graph.setData({
                                                    nodes: nodesData,
                                                    edges: linksData
                                                });

                                            } else { //是云节点
                                                for (var b = 0; b < nodes0.length; b++) {
                                                    if (nodes0[b].id === nodeId) {
                                                        nodes0[b].x = nodePosObj[nodeId].x;
                                                        nodes0[b].y = nodePosObj[nodeId].y;
                                                        $rootScope[nodes0[b].id] = nodePosObj[nodeId];
                                                    }
                                                }
                                            }
                                        }
                                    });

                                }

                            }


                        }








                        return graph;
                    }
                });

            }
        };
    }]);

    topology.register.directive('topologyService', ['ServiceTopologySvc', '$rootScope', '$filter', function(ServiceTopologySvc, $rootScope, $filter) {
        return {
            restrict: 'EACM',
            scope: {
                pwData: '=',
                type: '='
            },
            template: '<div style="margin:5px 0px; padding-left: 40px;"><div><span style="font-weight:700;color:black;">{{topoType}}</span>&nbsp;&nbsp;{{label}} &nbsp;&nbsp;<span title="{{Info.eline}}"class="icon-question-sign icon-large" style="color: #428bca;"></span>' +
                '<button class="icon-arrow-left pull-right" title="{{Info.backBtn}}" ng-click="backTopology()" ng-show="backBtnDisabled" style="color: white;background-color: #428bca;border-color: #428bca;margin-right: 30px;"></button></div>' +
                '<div class="col-md-12 topologyview" style="height: 600px;" id="pwgraph"></div>' +
                '<div class="modal fade" id="sameNodeElineModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">' +
                '<div class="modal-dialog" style="width: 60%">' +
                '<div class="modal-content" style="background-color:#EBECF1">' +
                '<form name="sameNodeElineName">' +
                '<div class="modal-header">' +
                '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>' +
                '<h4 class="modal-title" id="myModalLabel">{{"ElineTopoHead" | translate}}</h4></div>' +
                '<div class="modal-body">' +
                '<div>' +
                '<div class="pull-left" style="padding-right: 20px;">{{"ElineUserlabel" | translate}}：' +
                '<select ng-model="elineModal.selectElineId" style="width:125px;" ng-change="elineModal.changeElineId()">' +
                '<option ng-repeat="eline in elineModal.elineList" value="{{eline.elineId}}" >{{eline.userlabel}}</option>' +
                '</select>' +
                '</div>' +
                '<table cellpadding="5">' +
                '<tbody class="table ng-pristine ng-untouched ng-valid">' +
                '<caption style="font-size: 700;color: white;background-color: #908f8f;text-align: center;">{{"ElineLinkInfo" | translate}}</caption>' +
                '<tr><td>{{"ELineType" | translate}}：</td><td style="padding-right: 30px;">{{elineModal.elineLink.elineType}}</td><td>{{"ElineStatus" | translate}}：</td><td>{{elineModal.elineLink.operateStatus}}</td></tr> ' +
                '<tr><td>{{"ElineSourceNode" | translate}}:</td><td style="padding-right: 30px;">{{elineModal.elineLink.sourceNodes}}</td> <td>{{"ElineDestNode" | translate}}:</td><td>{{elineModal.elineLink.destNodes}}</td> </tr>' +
                '<tr><td>{{"ElineSourcePort" | translate}}:</td><td style="padding-right: 30px;">{{elineModal.elineLink.leftLtpId}}</td><td>{{"ElineDestPort" | translate}}:</td><td>{{elineModal.elineLink.rightLtpId}}</td> </tr>' +
                '<tr><td>{{"ElineSourceVlan" | translate}}:</td><td style="padding-right: 30px;">{{elineModal.elineLink.leftVlanList}}</td><td>{{"ElineDestVlan" | translate}}:</td> <td>{{elineModal.elineLink.rightVlanList}}</td></tr> ' +
                '<td>{{"ElineRole" | translate}}：</td><td>{{elineModal.elineLink.role}}</td></tr>' +
                '</tbody> ' +
                '</table>' +
                '</div>' +
                '<div class="modal-footer">' +
                '<button type="button" class="btn btn-default" ng-disabled="sameNodeElineName.$invalid"ng-click="elineModal.submitSelectElineId()">{{"ElineOK" | translate }} </button>' +
                '<button type="button" class="btn btn-default" data-dismiss="modal" aria-hidden="true">{{"Close" | translate }}</button>' +
                '</div>' +
                '</form>' +
                ' </div>' +
                '</div>' +
                '</div>' +
                '</div>',
            replace: true,
            controller: function($scope, $element) {
                $scope.label = 'Eline';
                $scope.backlabel = 'Eline';
                $scope.topoType = $filter('translate')('Eline Topology');
            },
            link: function($scope, iElm, iAttrs, controller) {
                //窗口信息数据模型
                $('#sameNodeElineModal').modal('hide');

                $scope.Info = {
                    eline: $filter('translate')('ElineTopologyInfo'),
                    backbtn: $filter('translate')('BackPreTopo')
                };

                //选择业务的窗口数据模型
                $scope.elineModal = {
                    selectElineId: '', //选择要展示pw基于的业务
                    elineList: [], //下拉框可选择的业务id和userlabel
                    elineLink: {} //展示某条业务的具体信息
                };

                //缓存eline数据
                $scope.elineObj = {};
                $scope.elineObj.topologyData = {}; //拓扑数据模型
                $scope.elineObj.oSameNodeEline = {};
                $.extend(true, $scope.elineObj.oSameNodeEline, $scope.pwData.oSameNodeEline); //存在源宿节点一致业务不同的链路信息
                $scope.elineObj.doubleCilckEdgeId = ''; //双击业务拓扑链路的id值
                $.extend(true, $scope.elineObj.topologyData, $scope.pwData);

                //缓存pw数据
                $scope.pwObj = {};
                $scope.pwObj.IsOpenCloud = {};
                $scope.pwObj.RawTopologyData = {};
                $scope.pwObj.IsCloudNodeIds = [];
                $scope.pwObj.CloseCloudTopologyData = {};

                //缓存lsp数据
                $scope.lspObj = {};
                $scope.lspObj.IsOpenCloud = {};
                $scope.lspObj.RawTopologyData = {};
                $scope.lspObj.IsCloudNodeIds = [];
                $scope.lspObj.CloseCloudTopologyData = {};

                //vis
                //$scope.graph = {};
                $scope.currentTopoData = {};
                $scope.backBtnDisabled = false;

                //刷新DOM
                $scope.applyList = function(cb) {
                    if (!$rootScope.$$phase) {
                        $scope.$apply(cb);
                    }
                };

                //获取pw拓扑数据的回调函数
                $scope.getPwTopologyCallback = function(data, initData, cloudNodes) {};

                //业务拓扑选择业务点击窗口的提交按钮事件
                $scope.elineModal.submitSelectElineId = function() {
                    var clickEdgeId = $scope.elineObj.doubleCilckEdgeId;
                    var aConnectNodeId = $scope.graph.getConnectedNodes(clickEdgeId);
                    var selectElineId = $scope.elineModal.selectElineId;
                    var aa = aConnectNodeId[0] + aConnectNodeId[1];
                    var bb = aConnectNodeId[1] + aConnectNodeId[0];
                    var data = $scope.elineObj.oSameNodeEline;
                    var sElineUserLabel = '';

                    if (selectElineId && data) {
                        var nodename = '';

                        if (data[aa] === undefined && data[bb] !== undefined) {
                            nodename = bb;
                        } else if (data[aa] !== undefined && data[bb] === undefined) {
                            nodename = aa;
                        }

                        if (data[nodename] && data[nodename].data) {
                            angular.forEach(data[nodename].data, function(link) {
                                if (link.elineId == selectElineId) {
                                    sElineUserLabel = link.userlabel;
                                }
                            });
                        }

                        if (sElineUserLabel) {
                            ServiceTopologySvc.getPwTopology({
                                id: selectElineId,
                                userlabel: sElineUserLabel,
                                nodes: $scope.specElineNodes
                            }, function(data, initData, cloudNodes) {
                                //$scope.getPwTopologyCallback(data, initData, cloudNodes);
                                $('#sameNodeElineModal').modal('hide');

                                $scope.pwObj.RawTopologyData = {};
                                $scope.pwObj.CloseCloudTopologyData = {};
                                $scope.pwObj.IsCloudNodeIds.length = 0;
                                $scope.currentTopoData = {};

                                $.extend(true, $scope.pwObj.RawTopologyData, initData);
                                $.extend(true, $scope.pwObj.CloseCloudTopologyData, data);
                                $.extend(true, $scope.pwObj.IsCloudNodeIds, cloudNodes);
                                $.extend(true, $scope.currentTopoData, data);
                                $scope.graph.setData(data);
                                $scope.type = "pw";

                                $scope.backBtnDisabled = true;
                                $scope.label = "Eline:" + sElineUserLabel;
                                $scope.backlabel = "Eline:" + selectElineId;
                                $scope.topoType = $filter('translate')('PW Topology');
                                $scope.applyList(function() {
                                    $scope.label = "Eline:" + sElineUserLabel;
                                    $scope.backlabel = "Eline:" + selectElineId;
                                    $scope.topoType = $filter('translate')('PW Topology');
                                });

                                for (var topoid in cloudNodes) {
                                    $scope.pwObj.IsOpenCloud[topoid] = false;
                                }
                            });
                        }
                    }
                };

                //业务拓扑选择业务展示对应的业务基本信息
                $scope.elineModal.changeElineId = function() {
                    var data = $scope.elineObj.oSameNodeEline;
                    var clickEdgeId = $scope.elineObj.doubleCilckEdgeId;
                    var aConnectNodeId = $scope.graph.getConnectedNodes(clickEdgeId);
                    var selectElineId = $scope.elineModal.selectElineId;
                    var aa = aConnectNodeId[0] + aConnectNodeId[1];
                    var bb = aConnectNodeId[1] + aConnectNodeId[0];

                    if (data[aa] !== undefined && data[bb] === undefined) {
                        if (data[aa].data) {
                            angular.forEach(data[aa].data, function(link, index) {
                                if (link.elineId == selectElineId) {
                                    $scope.elineModal.elineLink = link;
                                }
                            });
                        }
                    } else if (data[aa] === undefined && data[bb] !== undefined) {
                        if (data[bb].data) {
                            angular.forEach(data[bb].data, function(link, index) {
                                if (link.elineId == selectElineId) {
                                    $scope.elineModal.elineLink = link;
                                }
                            });
                        }
                    }
                };

                //双击业务拓扑的链路
                $scope.elineObj.doubleCilckLink = function(properties) {
                    var elineId = properties.edges[0].split('$%@*^#')[1];
                    var elineUserlabel = properties.edges[0].split('$%@*^#')[2];
                    var elineIdNodes = [];
                    var sFindIndex = properties.edges[0].indexOf('$%@*^#sameNode');
                    $scope.elineObj.doubleCilckEdgeId = properties.edges[0];

                    //查找指定eline id下的所有原宿节点
                    angular.forEach($scope.currentTopoData.edges, function(edge, index) {
                        if (edge.elineId === elineId) {
                            if (elineIdNodes.indexOf(edge.from) === -1) {
                                elineIdNodes.push(edge.from);
                            }

                            if (elineIdNodes.indexOf(edge.to) === -1) {
                                elineIdNodes.push(edge.to);
                            }
                        }
                    });
                    $scope.specElineNodes = elineIdNodes;

                    var pwByElineId = '';
                    var pwByElineUserlabel = '';

                    if (sFindIndex !== -1) {
                        $('#sameNodeElineModal').modal('show');

                        var data = $scope.elineObj.oSameNodeEline;
                        var clickEdgeId = $scope.elineObj.doubleCilckEdgeId;
                        var aConnectNodeId = $scope.graph.getConnectedNodes(clickEdgeId);

                        var aa = aConnectNodeId[0] + aConnectNodeId[1];
                        var bb = aConnectNodeId[1] + aConnectNodeId[0];

                        if (data) {
                            if (data[aa] !== undefined && data[bb] === undefined) {
                                if (data[aa].elineList) {
                                    $scope.elineModal.elineList = data[aa].elineList;
                                    $scope.applyList(function() {
                                        $scope.elineModal.elineList = data[aa].elineList;

                                        if ($scope.elineModal.elineList[0]) {
                                            $scope.elineModal.selectElineId = $scope.elineModal.elineList[0].elineId;
                                            $scope.elineModal.changeElineId();
                                        }
                                    });
                                }
                            } else if (data[bb] !== undefined && data[aa] === undefined) {
                                if (data[bb].elineList) {
                                    $scope.elineModal.elineList = data[aa].elineList;
                                    $scope.applyList(function() {
                                        $scope.elineModal.elineList = data[aa].elineList;

                                        if ($scope.elineModal.elineList[0]) {
                                            $scope.elineModal.selectElineId = $scope.elineModal.elineList[0].elineId;
                                            $scope.elineModal.changeElineId();
                                        }
                                    });
                                }
                            }
                        }
                    } else {
                        pwByElineId = elineId;
                        pwByElineUserlabel = elineUserlabel;

                        ServiceTopologySvc.getPwTopology({
                            id: pwByElineId,
                            userlabel: pwByElineUserlabel,
                            nodes: elineIdNodes
                        }, function(data, initData, cloudNodes) {
                            //$scope.getPwTopologyCallback(data, initData, cloudNodes);

                            $scope.pwObj.RawTopologyData = {};
                            $scope.pwObj.CloseCloudTopologyData = {};
                            $scope.pwObj.IsCloudNodeIds.length = 0;
                            $scope.currentTopoData = {};

                            $.extend(true, $scope.pwObj.RawTopologyData, initData);
                            $.extend(true, $scope.pwObj.CloseCloudTopologyData, data);
                            $.extend(true, $scope.pwObj.IsCloudNodeIds, cloudNodes);
                            $.extend(true, $scope.currentTopoData, data);
                            $scope.graph.setData(data);
                            $scope.type = "pw";

                            $scope.backBtnDisabled = true;
                            $scope.label = "Eline:" + pwByElineUserlabel;
                            $scope.backlabel = "Eline:" + pwByElineId;
                            $scope.topoType = $filter('translate')('PW Topology');
                            $scope.applyList(function() {
                                $scope.label = "Eline:" + pwByElineUserlabel;
                                $scope.backlabel = "Eline:" + pwByElineId;
                                $scope.topoType = $filter('translate')('PW Topology');
                            });

                            for (var topoid in cloudNodes) {
                                $scope.pwObj.IsOpenCloud[topoid] = false;
                            }
                        });
                    }
                };

                //双击pw拓扑链路
                $scope.pwObj.doubleCilckLink = function(properties) {
                    var elineIdPw = properties.edges[0].split('$%@*^#')[1];
                    var pwId = properties.edges[0].split('$%@*^#')[2];
                    var elineUserlabel = properties.edges[0].split('$%@*^#')[3];
                    var pwUserlabel = properties.edges[0].split('$%@*^#')[4];
                    var pwNodes = [];

                    angular.forEach($scope.currentTopoData.edges, function(edge, index) {
                        if (edge.elineid == elineIdPw && edge.pwid == pwId) {
                            if (edge.from.indexOf('cloudNodeId') == -1 && edge.to.indexOf('cloudNodeId') == -1) {
                                if (pwNodes.indexOf(edge.from) === -1) {
                                    pwNodes.push(edge.from);
                                }
                                if (pwNodes.indexOf(edge.to) === -1) {
                                    pwNodes.push(edge.to);
                                }
                            }
                        }
                    });

                    if (pwNodes.length !== 0) {
                        ServiceTopologySvc.getLspTopology({
                            elineid: elineIdPw,
                            pwid: pwId,
                            nodes: pwNodes
                        }, function(data, initData, cloudNodes) {
                            $scope.lspObj.RawTopologyData = {};
                            $scope.lspObj.CloseCloudTopologyData = {};
                            $scope.lspObj.IsCloudNodeIds.length = 0;
                            $scope.currentTopoData = {};

                            $.extend(true, $scope.lspObj.RawTopologyData, initData);
                            $.extend(true, $scope.lspObj.CloseCloudTopologyData, data);
                            $.extend(true, $scope.lspObj.IsCloudNodeIds, cloudNodes);
                            $.extend(true, $scope.currentTopoData, data);
                            $scope.graph.setData(data);
                            $scope.type = "lsp";
                            $scope.backBtnDisabled = true;
                            $scope.label = "Eline:" + elineUserlabel + "/" + "PW:" + pwUserlabel;
                            $scope.backlabel = "Eline:" + elineIdPw + "/" + "PW:" + pwId;
                            $scope.topoType = $filter('translate')('LSP Topology');
                            $scope.applyList(function() {
                                $scope.label = "Eline:" + elineUserlabel + "/" + "PW:" + pwUserlabel;
                                $scope.backlabel = "Eline:" + elineIdPw + "/" + "PW:" + pwId;
                                $scope.topoType = $filter('translate')('LSP Topology');
                            });

                            for (var topoid in cloudNodes) {
                                $scope.lspObj.IsOpenCloud[topoid] = false;
                            }
                        });
                    } else {
                        return;
                    }
                };

                //根据当前云的状态绘制拓扑图
                $scope.formatOpenCloseCloudtopoData = function(sLinkId, oTopoData) {
                    //展开云的拓扑数据
                    var newEdges = [],
                        newNodes = [],
                        newInitEdges = [],
                        newInitNodes = [];
                    var openCloudVisData = [];

                    $.extend(true, newEdges, oTopoData.CloseCloudTopologyData.edges);
                    $.extend(true, newNodes, oTopoData.CloseCloudTopologyData.nodes);
                    $.extend(true, newInitEdges, oTopoData.RawTopologyData.edges);
                    $.extend(true, newInitNodes, oTopoData.RawTopologyData.nodes);

                    for (var name in oTopoData.IsOpenCloud) {
                        var aPwYesCloudNodes = oTopoData.IsCloudNodeIds[name];
                        var cloudNode = {
                            id: 'cloudNodeId' + '$%@*^#' + name,
                            label: 'Cloud:' + name,
                            size: 45,
                            topoId: name,
                            group: 'cloud'
                                //title: 'Cloud'
                        };
                        newInitNodes.push(cloudNode);

                        if (oTopoData.IsOpenCloud[name]) { //展开云
                            for (var df = 0; df < aPwYesCloudNodes.length; df++) {
                                var link = {
                                    id: 'cloudLinkId' + '$%@*^#' + name + aPwYesCloudNodes[df].id,
                                    from: aPwYesCloudNodes[df].id,
                                    to: cloudNode.id,
                                    sd: aPwYesCloudNodes[df].id + cloudNode.id,
                                    color: 'gray',
                                    dashes: true
                                };
                                newInitEdges.push(link);
                            }

                            openCloudVisData[name] = {
                                nodes: newInitNodes,
                                edges: newInitEdges
                            };

                        } else { //不展开云
                            var oCloudNode;
                            for (la = 0; la < newNodes.length; la++) {
                                if (newNodes[la].id == 'cloudNodeId$%@*^#' + name) {
                                    oCloudNode = newNodes[la];
                                }
                            }

                            var closeNodeData = [];
                            for (var lb = 0; lb < aPwYesCloudNodes.length; lb++) {
                                for (var lc = 0; lc < newInitEdges.length; lc++) {
                                    if (newInitEdges[lc].from == aPwYesCloudNodes[lb].id) {
                                        newInitEdges[lc].from = oCloudNode.id;
                                        newInitEdges[lc].color = 'blue';
                                        delete newInitEdges[lc].title;
                                    }

                                    if (newInitEdges[lc].to == aPwYesCloudNodes[lb].id) {
                                        newInitEdges[lc].to = oCloudNode.id;
                                        newInitEdges[lc].color = 'blue';
                                        delete newInitEdges[lc].title;
                                    }

                                    newInitEdges[lc].sd = newInitEdges[lc].from + newInitEdges[lc].to;

                                }

                                /*for(var ld = 0 ; ld < newInitNodes.length; ld++){
                                    if(newInitNodes[ld].id == aPwYesCloudNodes[lb].id){
                                        newInitNodes.splice(ld ,1);
                                    }
                                }*/
                            }

                            var newVisNodes = ServiceTopologySvc.deleteExtCloudNodes(aPwYesCloudNodes, newInitNodes);

                            newInitNodes.length = 0;
                            $.extend(true, newInitNodes, newVisNodes);


                        }
                    }

                    //repeat
                    var newACloseEdges = ServiceTopologySvc.deleteRepeatEdges(newInitEdges);

                    openCloudVisData = {
                        nodes: newInitNodes,
                        edges: newACloseEdges
                    };

                    return openCloudVisData;
                };

                //双击云的点击事件
                $scope.doubleCilckCloud = function(properties) {
                    var cloudPre = properties.nodes[0].split('$%@*^#')[0];
                    var topoId = properties.nodes[0].split('$%@*^#')[1];

                    if (cloudPre == 'cloudNodeId') {
                        if ($scope.type == 'pw') {
                            $scope.pwObj.IsOpenCloud[topoId] = !$scope.pwObj.IsOpenCloud[topoId];
                            var datapw = $scope.formatOpenCloseCloudtopoData(properties.nodes[0], $scope.pwObj);
                            $scope.currentTopoData = {};
                            $.extend(true, $scope.currentTopoData, datapw);
                            $scope.graph.setData(datapw);
                        } else if ($scope.type == 'lsp') {
                            $scope.lspObj.IsOpenCloud[topoId] = !$scope.lspObj.IsOpenCloud[topoId];
                            var datalsp = $scope.formatOpenCloseCloudtopoData(properties.nodes[0], $scope.lspObj);
                            $scope.currentTopoData = {};
                            $.extend(true, $scope.currentTopoData, datalsp);
                            $scope.graph.setData(datalsp);
                        }
                    }
                };

                //点击返回键的事件
                $scope.backTopology = function() {
                    if ($scope.type == 'pw') {
                        ServiceTopologySvc.getElineTopology(function(data, node, oSameNodeEline) {
                            $scope.currentTopoData = {};
                            $.extend(true, $scope.elineObj.oSameNodeEline, oSameNodeEline);
                            $.extend(true, $scope.pwData.oSameNodeEline, oSameNodeEline);

                            $.extend(true, $scope.currentTopoData, data);
                            $scope.graph.setData(data);
                            $scope.pwData = data;
                            $scope.type = 'eline';
                            $scope.label = "Eline";
                            $scope.topoType = $filter('translate')('Eline Topology');
                            $scope.backlabel = "Eline";
                            $scope.backBtnDisabled = false;
                            $scope.applyList(function() {
                                $scope.label = "Eline";
                                $scope.backlabel = "Eline";
                                $scope.topoType = $filter('translate')('ELine Topology');
                            });
                        });
                    } else if ($scope.type == 'lsp') {
                        var eline = $scope.backlabel.split('/')[0];
                        var pw = $scope.backlabel.split('/')[1];
                        var backElineId = eline.split(':')[1];
                        var backPwId = pw.split(':')[1];

                        var elineq = $scope.label.split('/')[0];
                        var pwq = $scope.label.split('/')[1];
                        var backElineUserlabel = elineq.split(':')[1];
                        var backPwUserLabel = pwq.split(':')[1];

                        ServiceTopologySvc.getPwTopology({
                            id: backElineId,
                            userlabel: backElineUserlabel,
                            nodes: $scope.specElineNodes
                        }, function(data, initData, cloudNodes) {
                            $scope.currentTopoData = {};
                            $.extend(true, $scope.currentTopoData, data);
                            $scope.graph.setData(data);
                            $scope.type = "pw";
                            $scope.backBtnDisabled = true;
                            for (var topoid in cloudNodes) {
                                $scope.pwObj.IsOpenCloud[topoid] = false;
                            }
                            $scope.label = "Eline:" + backElineUserlabel;
                            $scope.topoType = $filter('translate')('PW Topology');
                            $scope.backlabel = "Eline:" + backElineId;
                            $scope.applyList(function() {
                                $scope.label = "Eline:" + backElineUserlabel;
                                $scope.backlabel = "Eline:" + backElineId;
                                $scope.topoType = $filter('translate')('PW Topology');
                            });
                        });
                    }
                };

                //根据过滤条件过滤
                $scope.filterTopoData = function(oTopo) {
                    if (oTopo) {
                        var inNodes = oTopo.nodes;
                        var inEdges = oTopo.edges;

                        var filterSrcNode = oTopo.filterSrc;
                        var filterDesNode = oTopo.filterDes;

                        if (inNodes && inEdges) {
                            if (filterSrcNode && filterSrcNode !== undefined && filterDesNode && filterDesNode !== undefined) {
                                var hehe = filterSrcNode + filterDesNode;
                                var he = filterDesNode + filterSrcNode;

                                inEdges = inEdges.filter(function(item, index) {
                                    //return ((item.sd.indexOf(hehe)) >= 0 || (item.sd.indexOf(he)) >= 0);
                                    if (item.sd) {
                                        return ((item.sd.indexOf(filterSrcNode)) >= 0 && (item.sd.indexOf(filterDesNode)) >= 0);
                                    } else {
                                        return false;
                                    }
                                });
                                if (inEdges.length > 0) {
                                    inNodes = inNodes.filter(function(item, index) {
                                        if (item.userlabel) {
                                            return (item.userlabel.indexOf(filterSrcNode)) >= 0 || (item.userlabel.indexOf(filterDesNode)) >= 0;
                                        } else {
                                            return false;
                                        }
                                    });
                                } else {
                                    inNodes = [];
                                }
                            }
                        }

                        var data = {
                            nodes: inNodes,
                            edges: inEdges
                        };

                        return data;
                    } else {
                        return {};
                    }
                };

                var hl = '#0066FF',
                    hover = '#33CC33',
                    WHITE = '#eee',
                    BLACK = '#2B1B17';
                var options = {
                    width: '100%',
                    height: '600px',
                    nodes: {
                        //size: 50,
                        color: {
                            background: BLACK
                        }
                    },
                    edges: {
                        //length: 60,
                        width: 3,
                        //dashes: true,
                        smooth: {
                            enabled: true,
                            type: "straightCross",
                            roundness: 0.5
                        }
                    },
                    physics: {
                        barnesHut: {
                            gravitationalConstant: 0,
                            springConstant: 0,
                            centralGravity: 0
                        }
                    },

                    groups: {
                        'sdn-down': {
                            shape: 'image',
                            image: 'assets/images/node-down.png'
                        },
                        'sdn-up': {
                            shape: 'image',
                            image: 'assets/images/node-up.png'
                        },
                        'sdn-power-up': {
                            shape: 'image',
                            image: 'assets/images/node-lost.png'
                        },
                        'sdn-power-down': {
                            shape: 'image',
                            image: 'assets/images/node-down.png'
                        },
                        'ext-down': {
                            shape: 'image',
                            image: 'assets/images/ext-down.png'
                        },
                        'ext-up': {
                            shape: 'image',
                            image: 'assets/images/ext-up.png'
                        },
                        'ext-power-down': {
                            shape: 'image',
                            image: 'assets/images/ext-down.png'
                        },
                        'ext-power-up': {
                            shape: 'image',
                            image: 'assets/images/ext-lost.png'
                        },
                        'cloud': {
                            shape: 'image',
                            image: 'assets/images/clouds.png'
                        },
                        interaction: {
                            navigationButtons: true,
                            keyboard: false
                        }
                    }
                    //keyboard: true
                };

                if ($scope.type == 'eline') {
                    options.hierarchical.direction = 'LR';
                }
                var container = document.getElementById('pwgraph');
                var data = $scope.filterTopoData($scope.pwData);
                $scope.currentTopoData = {};
                $.extend(true, $scope.currentTopoData, data);
                $scope.graph = new vis.Network(container, data, options);
                $scope.graph.on('doubleClick', function(properties) {
                    var nodesinfo = JSON.stringify(properties.nodes);
                    var linksinfo = JSON.stringify(properties.edges);

                    if (nodesinfo === "[]" && linksinfo !== "[]") {
                        if ($scope.type == 'eline') {
                            $scope.elineObj.doubleCilckLink(properties);
                        } else if ($scope.type == 'pw') {
                            $scope.pwObj.doubleCilckLink(properties);
                        }
                    } else if (nodesinfo !== "[]" && linksinfo !== "[]") {
                        $scope.doubleCilckCloud(properties);
                    }
                });

                $scope.$watch('pwData', function(newvalue, oldvalue) {
                    if (newvalue) {
                        var data = $scope.filterTopoData($scope.pwData);
                        $scope.currentTopoData = {};
                        $.extend(true, $scope.currentTopoData, $scope.pwData);
                        $scope.label = 'Eline';
                        $scope.topoType = $filter('translate')('Eline Topology');
                        $scope.backlabel = 'Eline';
                        $.extend(true, $scope.elineObj.oSameNodeEline, $scope.pwData.oSameNodeEline);
                        $scope.applyList(function() {
                            $scope.label = 'Eline';
                            $scope.backlabel = 'Eline';
                            $scope.topoType = $filter('translate')('Eline Topology');
                            $scope.backBtnDisabled = false;
                        });
                        $scope.graph.setData(data);
                    }
                });

                return $scope.graph;
            }
        };
    }]);

    //manager-topology
    topology.register.directive('topologyManager', ['ManagerTopologySvc', '$rootScope', function(ManagerTopologySvc, $rootScope) {
        return {
            restrict: 'EAC',
            scope: {
                topologyData: '='
            },
            link: function($scope, element, attrs, controller) {
                $scope.$watch('topologyData', function(newTopologyData, oldTopologyData) {
                    if (newTopologyData) {
                        var aNodes = $scope.topologyData.nodes;
                        var aLinks = $scope.topologyData.edges;
                        var sFilterId = $scope.topologyData.filterId;
                        var sFilterUserLabel = $scope.topologyData.filterUserLabel;
                        var sFilterName = $scope.topologyData.filterName;
                        //$scope.cloudStatus = $scope.topologyData.cloudStatus;

                        /*filter by node id*/
                        if (sFilterId && sFilterId !== undefined) {
                            aNodes = aNodes.filter(function(item, index) {
                                return (item.id.indexOf(sFilterId) >= 0);
                            });

                            if (aNodes) {
                                aLinks = aLinks.filter(function(item, index) {
                                    return ((item.from.indexOf(sFilterId) >= 0) && (item.to.indexOf(sFilterId) >= 0));
                                });
                            }
                        }

                        /*filter by userlabel*/
                        if (sFilterUserLabel && sFilterUserLabel !== undefined) {
                            aNodes = aNodes.filter(function(item, index) {
                                if (item.userlabel) {
                                    return (item.userlabel.indexOf(sFilterUserLabel) >= 0);
                                } else {
                                    return false;
                                }
                            });

                            if (aNodes) {
                                var aAllNodeId = '';
                                angular.forEach(aNodes, function(node, index) {
                                    aAllNodeId += node.id;
                                });

                                aLinks = aLinks.filter(function(item, index) {
                                    return ((aAllNodeId.indexOf(item.from) >= 0) && (aAllNodeId.indexOf(item.to) >= 0));
                                });
                            }
                        }

                        /*filter by name*/
                        if (sFilterName && sFilterName !== undefined) {
                            aNodes = aNodes.filter(function(item, index) {
                                if (item.name) {
                                    return (item.name.indexOf(sFilterName) >= 0);
                                } else {
                                    return false;
                                }
                            });

                            if (aNodes) {
                                var aAllNodeId1 = '';
                                angular.forEach(aNodes, function(node, index) {
                                    aAllNodeId1 += node.id;
                                });

                                aLinks = aLinks.filter(function(item, index) {
                                    return ((aAllNodeId1.indexOf(item.from) >= 0) && (aAllNodeId1.indexOf(item.to) >= 0));
                                });
                            }
                        }

                        /*config vis options*/
                        var container = element[0];
                        var visData = {
                            nodes: aNodes,
                            edges: aLinks
                        };

                        var hl = '#0066FF',
                            hover = '#33CC33',
                            WHITE = '#eee',
                            BLACK = '#2B1B17';

                        var options = {
                            width: '100%',
                            height: '600px',
                            nodes: {
                                //size: 50,
                                color: {
                                    background: BLACK
                                }
                            },
                            edges: {
                                //length: 60,
                                width: 3,
                                //dashes: true,
                                smooth: {
                                    enabled: true,
                                    type: "straightCross",
                                    roundness: 0.5
                                }
                            },
                            physics: {
                                barnesHut: {
                                    gravitationalConstant: 0,
                                    springConstant: 0,
                                    centralGravity: 0
                                }
                            },

                            groups: {
                                'sdn-up': {
                                    shape: 'image',
                                    image: 'assets/images/node-up.png'
                                },
                                'sdn-down': {
                                    shape: 'image',
                                    image: 'assets/images/node-down.png'
                                },
                                'ext-up': {
                                    shape: 'image',
                                    image: 'assets/images/ext-up.png'
                                },
                                'ext-down': {
                                    shape: 'image',
                                    image: 'assets/images/ext-down.png'
                                },
                                'cloud': {
                                    shape: 'image',
                                    image: 'assets/images/clouds.png'
                                }
                            },
                            interaction: {
                                navigationButtons: true,
                                keyboard: false
                            }
                            //keyboard: true,
                            /*tooltip: {
                                delay: 300,
                                fontColor: 'black',
                                fontSize: 14,
                                fontFace: 'Microsoft YaHei',
                                color: {
                                    border: '#25a2dc',
                                    background: '#fcb546'
                                }
                            }*/
                            //keyboard: true
                        };

                        var graph = new vis.Network(container, visData, options);

                        graph.on('doubleClick', function(properties) {
                            var nodesinfo = JSON.stringify(properties.nodes);
                            var linksinfo = JSON.stringify(properties.edges);

                            if ((nodesinfo !== '[]' && linksinfo !== '[]') || (nodesinfo !== '[]' && linksinfo == '[]')) {
                                var cloudeId = properties.nodes[0];
                                if (cloudeId) {
                                    var topoId = cloudeId.split('-')[1];
                                    var sPre = cloudeId.split('-')[0];

                                    if (sPre == 'CloudNodeId') {
                                        //$scope.cloudStatus[topoId] = !$scope.cloudStatus[topoId];
                                        $rootScope.managerTopologyStatus[topoId] = !$rootScope.managerTopologyStatus[topoId];

                                        ManagerTopologySvc.getInitData($rootScope.gNodeLabel, function(data) {
                                            ManagerTopologySvc.initCloudData(data, $rootScope.managerTopologyStatus, function(topoData) {
                                                graph.setData(topoData);
                                            });
                                        });
                                    }
                                }
                            }
                        });

                        return graph;
                    }
                });
            }
        };
    }]);

    //liuliang
    topology.register.directive('topologyFlow', ['FlowMonitorTopologySvc', '$rootScope', function(FlowMonitorTopologySvc, $rootScope) {
        return {
            restrict: 'EAC',
            scope: {
                flowData: '='
            },
            link: function($scope, element, attrs, controller) {
                $scope.$watch('flowData', function(newTopologyData, oldTopologyData) {
                    if (newTopologyData) {
                        var aNodes = $scope.flowData.nodes;
                        var aLinks = $scope.flowData.edges;
                        var sFilterType = $scope.flowData.filterType;
                        var sFilterLinkName = $scope.flowData.filterLinkName;

                        /*filter start*/
                        if (sFilterType && sFilterLinkName !== undefined) {
                            if (sFilterType == 'none') {
                                if (sFilterLinkName && sFilterLinkName !== undefined) {
                                    aLinks = aLinks.filter(function(item) {
                                        return (item.linkname.indexOf(sFilterLinkName) >= 0);
                                    });
                                }
                            } else {
                                if (sFilterType == 'superload') {
                                    aLinks = aLinks.filter(function(item) {
                                        return (parseFloat(item.rate) >= 0.8);
                                    });
                                } else if (sFilterType == 'overload') {
                                    aLinks = aLinks.filter(function(item) {
                                        return (parseFloat(item.rate) < 0.8 && parseFloat(item.rate) >= 0.6);
                                    });

                                } else if (sFilterType == 'underload') {
                                    aLinks = aLinks.filter(function(item) {
                                        return (parseFloat(item.rate) < 0.6);
                                    });
                                }

                                if (sFilterLinkName && sFilterLinkName !== undefined) {
                                    aLinks = aLinks.filter(function(item) {
                                        return (item.linkname.indexOf(sFilterLinkName) >= 0);
                                    });
                                }
                            }

                            var newNodes = [];
                            angular.forEach(aLinks, function(link) {
                                angular.forEach(aNodes, function(node) {
                                    if ((node.id == link.from) || (node.id == link.to)) {
                                        if (!FlowMonitorTopologySvc.checkNodeExist(newNodes, node.id)) {
                                            newNodes.push(node);
                                        }
                                    }
                                });
                            });

                            aNodes.length = 0;
                            $.extend(true, aNodes, newNodes);
                        }
                        /*filter end*/


                        /*config vis options*/
                        var container = element[0];
                        var visData = {
                            nodes: aNodes,
                            edges: aLinks
                        };

                        var hl = '#0066FF',
                            hover = '#33CC33',
                            WHITE = '#eee',
                            BLACK = '#2B1B17';

                        var options = {
                            width: '100%',
                            height: '600px',
                            nodes: {
                                //size: 50,
                                color: {
                                    background: BLACK
                                }
                            },
                            edges: {
                                //length: 60,
                                width: 3,
                                //dashes: true,
                                smooth: {
                                    enabled: true,
                                    type: "straightCross",
                                    roundness: 0.5
                                }
                            },
                            physics: {
                                barnesHut: {
                                    gravitationalConstant: 0,
                                    springConstant: 0,
                                    centralGravity: 0
                                }
                            },
                            groups: {
                                'sdn-up': {
                                    shape: 'image',
                                    image: 'assets/images/node-up.png'
                                },
                                'sdn-down': {
                                    shape: 'image',
                                    image: 'assets/images/node-down.png'
                                },
                                'ext-up': {
                                    shape: 'image',
                                    image: 'assets/images/ext-up.png'
                                },
                                'ext-down': {
                                    shape: 'image',
                                    image: 'assets/images/ext-down.png'
                                },
                                'cloud': {
                                    shape: 'image',
                                    image: 'assets/images/clouds.png'
                                }
                            },
                            interaction: {
                                navigationButtons: true,
                                keyboard: false
                            }
                            //keyboard: true
                        };

                        var graph = new vis.Network(container, visData, options);

                        var oAllNode = graph.getPositions();

                        if (oAllNode) {
                            FlowMonitorTopologySvc.updateNodePosition(oAllNode, function(cloudPosition) {
                                /*FlowMonitorTopologySvc.getInitData(function(data){
                                    var tempCloudStatus = {};
                                    if(data.cloudExtNodes){
                                        for(var name in data.cloudExtNodes){
                                            var flag = true;

                                            for(var topoid in $rootScope.flowTopologyStatus){
                                                if(name == topoid){
                                                    tempCloudStatus[name] = $rootScope.flowTopologyStatus[topoid];
                                                    flag = false;
                                                }
                                            }

                                            if(flag){
                                                tempCloudStatus[name] = false;
                                            }
                                        }
                                    }

                                    $.extend(true,$rootScope.flowTopologyStatus, tempCloudStatus);

                                    FlowMonitorTopologySvc.initCloudData(data, $rootScope.flowTopologyStatus, function(topoData){
                                        if(topoData){
                                            graph.setData(topoData);
                                        }
                                    });
                                });*/
                            });
                        }


                        graph.on('doubleClick', function(properties) {
                            var nodesinfo = JSON.stringify(properties.nodes);
                            var linksinfo = JSON.stringify(properties.edges);

                            if ((nodesinfo !== '[]' && linksinfo !== '[]') || (nodesinfo !== '[]' && linksinfo == '[]')) {
                                var cloudeId = properties.nodes[0];
                                if (cloudeId) {
                                    var topoId = cloudeId.split('-')[1];
                                    var sPre = cloudeId.split('-')[0];

                                    if (sPre == 'CloudNodeId') {
                                        $rootScope.flowTopologyStatus[topoId] = !$rootScope.flowTopologyStatus[topoId];

                                        FlowMonitorTopologySvc.getInitData($rootScope.gNodeLabel, function(data) {
                                            FlowMonitorTopologySvc.initCloudData(data, $rootScope.flowTopologyStatus, function(topoData) {
                                                graph.setData(topoData);
                                            });
                                        });
                                    }
                                }
                            }
                        });

                        graph.on('dragEnd', function(properties) {
                            if (properties) {

                                var oNode = graph.getPositions(properties.nodes[0]);

                                if (properties.nodes[0]) {
                                    if (properties.nodes[0].indexOf('CloudNodeId') !== -1) {
                                        return;
                                    }

                                    FlowMonitorTopologySvc.updateNodePosition(oNode, function() {
                                        /* FlowMonitorTopologySvc.getInitData(function(data){
                                             var tempCloudStatus = {};
                                             if(data.cloudExtNodes){
                                                 for(var name in data.cloudExtNodes){
                                                     var flag = true;

                                                     for(var topoid in $rootScope.flowTopologyStatus){
                                                         if(name == topoid){
                                                             tempCloudStatus[name] = $rootScope.flowTopologyStatus[topoid];
                                                             flag = false;
                                                         }
                                                     }

                                                     if(flag){
                                                         tempCloudStatus[name] = false;
                                                     }
                                                 }
                                             }

                                             $.extend(true,$rootScope.flowTopologyStatus, tempCloudStatus);

                                             FlowMonitorTopologySvc.initCloudData(data, $rootScope.flowTopologyStatus, function(topoData){
                                                 if(topoData){
                                                     graph.setData(topoData);
                                                 }
                                             });
                                         });*/
                                    });
                                }
                            }
                        });

                        return graph;
                    }
                });
            }
        };
    }]);
});
