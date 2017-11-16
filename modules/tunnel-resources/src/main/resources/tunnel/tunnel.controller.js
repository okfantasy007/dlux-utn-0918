define(['app/tunnel/tunnel.module', 'app/tunnel/tunnel.services', 'echarts'],
    function(tunnel, echarts) {

        tunnel.register.controller('rootTunnelCtrl',
            function($rootScope) {
                $rootScope['section_logo'] = 'assets/images/logo_inventory.gif';
                // $rootScope.$apply();
            });

        tunnel.register.controller('TunnelCtrl', function($scope, $state, $filter, TunnelSvc) {
            $scope.elineshow = true;
            $scope.tunnelshow = false;

            var countTunnelLb = 0;
            var countElineLb = 0;

            function getExtNodeUserLabelById(nodeId) {
                var nUserLabel;
                TunnelSvc.getExtNodeUserLabelById(nodeId, function(data) {
                    nUserLabel = data;
                });
                return nUserLabel;
            }

            function getNodeUserLabelById(nodeId) {
                var nUserLabel;
                TunnelSvc.getNodeUserLabelById(nodeId, function(data) {
                    nUserLabel = data;
                });
                if (nUserLabel === undefined) {
                    nUserLabel = getExtNodeUserLabelById(nodeId);
                }
                return nUserLabel;
            }

            //传入节点id和端口号
            function getPortUserLabel(nodeId, ltpId) {
                var pUserLabel;
                var connId = nodeId + ":" + ltpId;
                TunnelSvc.getPortUserLabel(nodeId, connId, function(data) {
                    pUserLabel = data;
                });
                if (pUserLabel === undefined) {
                    pUserLabel = connId;
                }
                return pUserLabel;
            }

            $scope.toggle = function(id) {
                if (id == 'eline') {
                    $scope.elineshow = true;
                    $scope.tunnelshow = false;
                } else {
                    $scope.elineshow = false;
                    $scope.tunnelshow = true;
                }
            };
            var elineLBObj = [];
            var elineLBPar = [];

            /*
            //测试数据
            $scope.elines = [{
                "pw": [{
                    "encaplate-type": "cep-mpls",
                    "ctrl-word-support": "nonsupport",
                    "sn-support": "nonsupport",
                    "vccv-type": "nonsupport",
                    "conn-ack-type": "none",
                    "admin-status": "admin-up",
                    "operate-status": "operate-up",
                    "id": "e8a0e6b1-3935-4aca-90c4-be257d7b7f15",
                    "name": "qqq-pw-1",
                    "index": 1,
                    "ingress-ne-id": "openflow:1",
                    "egress-ne-id": "openflow:19",
                    "qos": {
                        "qos-a2z-cir": 100000,
                        "qos-a2z-cbs": 1024,
                        "qos-a2z-pir": 300000,
                        "qos-a2z-pbs": 1024,
                        "qos-z2a-cir": 100000,
                        "qos-z2a-cbs": 1024,
                        "qos-z2a-pir": 100000,
                        "qos-z2a-pbs": 1024
                    },
                    "role": "master",
                    "oam": {
                        "localdetectmultiplier": "3",
                        "ttl": 255,
                        "localtxinterval": "3000"
                    },
                    "route": [{
                        "id": "1",
                        "snc-id": "11",
                        "xc": [{
                            "ne-id": "openflow:1",
                            "forward-out-label": "4000",
                            "backward-in-label": "4000"
                        }, {
                            "ne-id": "openflow:19",
                            "forward-in-label": "4000",
                            "backward-out-label": "4000"
                        }]
                    }]
                }, {
                    "encaplate-type": "cep-mpls",
                    "ctrl-word-support": "nonsupport",
                    "sn-support": "nonsupport",
                    "vccv-type": "nonsupport",
                    "conn-ack-type": "none",
                    "admin-status": "admin-up",
                    "operate-status": "operate-up",
                    "id": "7b2bd81f-de21-4ff8-8d43-84260b025a79",
                    "name": "qqq-pw-2",
                    "index": 2,
                    "ingress-ne-id": "openflow:1",
                    "egress-ne-id": "openflow:22",
                    "qos": {
                        "qos-z2a-cir": 100000,
                        "qos-z2a-cbs": 1024,
                        "qos-z2a-pir": 300000,
                        "qos-z2a-pbs": 1024,
                        "qos-a2z-cbs": 1024,
                        "qos-a2z-cir": 100000,
                        "qos-a2z-pbs": 1024,
                        "qos-a2z-pir": 300000
                    },
                    "role": "slave",
                    "oam": {
                        "localdetectmultiplier": "3",
                        "ttl": 255,
                        "localtxinterval": "3000"
                    },
                    "route": [{
                        "id": "1",
                        "snc-id": "11",
                        "xc": [{
                            "ne-id": "openflow:1",
                            "forward-out-label": "6000",
                            "backward-in-label": "6000"
                        }, {
                            "ne-id": "openflow:22",
                            "forward-in-label": "6000",
                            "backward-out-label": "6000"
                        }]
                    }]
                }],
                "ingress-end-points": [{
                    "ltp-id": "2",
                    "dot1q-vlan-bitmap": "100",
                    "id": 1,
                    "ne-id": "openflow:1"
                }],
                "egress-end-points": [{
                    "ltp-id": 1,
                    "dot1q-vlan-bitmap": "100",
                    "id": 1,
                    "ne-id": "openflow:19"
                }, {
                    "ltp-id": 1,
                    "dot1q-vlan-bitmap": "100",
                    "id": 2,
                    "ne-id": "openflow:22"
                }],
                "name": "qqq",
                "id": "7fab725e-2d46-492d-8eee-7082be79bfa6",
                "admin-status": "admin-up",
                "operate-status": "operate-up",
                "parent-ncd-id": "parent-ncd-id",
                "snc-type": "simple",
                "user-label": "qqq",
                "protection": {
                    "layer-rate": "pw",
                    "linear-protection-protocol": "NONE",
                    "wtr": "0",
                    "name": "qqq-pro1"
                },
                "calculate-constraint": {
                    "work-calculate-constraint": {
                        "explicit-include-ne": {
                            "explicit-include-ne-list": [{
                                "ne-id": "openflow:22",
                                "forward-in-label": "5000",
                                "backward-out-label": "5000",
                                "ingress-vlan": 1
                            }]
                        }
                    },
                    "protect-calculate-constraint": {
                        "explicit-include-ne": {
                            "explicit-include-ne-list": [{
                                "ne-id": "openflow:19",
                                "forward-in-label": "3000",
                                "backward-out-label": "3000",
                                "ingress-vlan": 1
                            }]
                        }
                    }
                }
            }, {
                "pw": [{
                    "encaplate-type": "cep-mpls",
                    "ctrl-word-support": "nonsupport",
                    "sn-support": "nonsupport",
                    "vccv-type": "nonsupport",
                    "conn-ack-type": "none",
                    "admin-status": "admin-up",
                    "operate-status": "operate-up",
                    "id": "e8a0e6b1-3935-4aca-90c4-be257d7b7f51",
                    "name": "ppp-pw-1",
                    "index": 1,
                    "ingress-ne-id": "openflow:1",
                    "egress-ne-id": "openflow:19",
                    "role": "master",
                    "oam": {
                        "localdetectmultiplier": "3",
                        "ttl": 255,
                        "localtxinterval": "3000"
                    },
                    "route": [{
                        "id": "1",
                        "snc-id": "11",
                        "xc": [{
                            "ne-id": "openflow:1",
                            "forward-out-label": "4000",
                            "backward-in-label": "4000"
                        }, {
                            "ne-id": "openflow:19",
                            "forward-in-label": "4000",
                            "backward-out-label": "4000"
                        }]
                    }]
                }, {
                    "encaplate-type": "cep-mpls",
                    "ctrl-word-support": "nonsupport",
                    "sn-support": "nonsupport",
                    "vccv-type": "nonsupport",
                    "conn-ack-type": "none",
                    "admin-status": "admin-up",
                    "operate-status": "operate-up",
                    "id": "7b2bd81f-de21-4ff8-8d43-84260b025a79",
                    "name": "qqq-pw-2",
                    "index": 2,
                    "ingress-ne-id": "openflow:1",
                    "egress-ne-id": "openflow:22",
                    "role": "slave",
                    "oam": {
                        "localdetectmultiplier": "3",
                        "ttl": 255,
                        "localtxinterval": "3000"
                    },
                    "route": [{
                        "id": "1",
                        "snc-id": "11",
                        "xc": [{
                            "ne-id": "openflow:1",
                            "forward-out-label": "6000",
                            "backward-in-label": "6000"
                        }, {
                            "ne-id": "openflow:22",
                            "forward-in-label": "6000",
                            "backward-out-label": "6000"
                        }]
                    }]
                }],
                "ingress-end-points": [{
                    "ltp-id": "2",
                    "dot1q-vlan-bitmap": "100",
                    "id": 1,
                    "ne-id": "openflow:1"
                }],
                "egress-end-points": [{
                    "ltp-id": 1,
                    "dot1q-vlan-bitmap": "100",
                    "id": 1,
                    "ne-id": "openflow:19"
                }, {
                    "ltp-id": 1,
                    "dot1q-vlan-bitmap": "100",
                    "id": 2,
                    "ne-id": "openflow:22"
                }],
                "name": "ppp",
                "id": "7fab725e-2d46-492d-8eee-7082be79bf6a",
                "admin-status": "admin-up",
                "operate-status": "operate-up",
                "parent-ncd-id": "parent-ncd-id",
                "snc-type": "simple",
                "user-label": "ppp",
                "protection": {
                    "layer-rate": "pw",
                    "linear-protection-protocol": "NONE",
                    "wtr": "0",
                    "name": "ppp-pro1"
                },
                "calculate-constraint": {
                    "work-calculate-constraint": {
                        "explicit-include-ne": {
                            "explicit-include-ne-list": [{
                                "ne-id": "openflow:22",
                                "forward-in-label": "5000",
                                "backward-out-label": "5000",
                                "ingress-vlan": 1
                            }]
                        }
                    },
                    "protect-calculate-constraint": {
                        "explicit-include-ne": {
                            "explicit-include-ne-list": [{
                                "ne-id": "openflow:19",
                                "forward-in-label": "3000",
                                "backward-out-label": "3000",
                                "ingress-vlan": 1
                            }]
                        }
                    }
                }
            }];
            //测试数据
            */



            function removeNullPro(obj) {
                if (obj && $.isEmptyObject(obj) === false) {
                    for (var pro in obj) {
                        if (!obj[pro] || obj[pro] === null || obj[pro] === "") {
                            delete obj[pro];
                        }
                    }
                }
                return obj;
            }

            function isQosExist(eline) {
                var flag = false;
                if (eline && eline.pw && eline.pw.length > 0) {
                    if ('qos' in eline.pw[0] === false) {
                        flag = false;
                    } else if ($.isEmptyObject(eline.pw[0]['qos']) === true) { //空对象
                        flag = false;
                    } else if (eline.pw[0]['qos']['qos-a2z-cir'] && eline.pw[0]['qos']['qos-a2z-pir'] && eline.pw[0]['qos']['qos-a2z-pir'] >= eline.pw[0]['qos']['qos-a2z-cir']) {
                        eline.pw[0]['qos']['qos-a2z-eir'] = eline.pw[0]['qos']['qos-a2z-pir'] - eline.pw[0]['qos']['qos-a2z-cir']; //EIR
                        flag = true;
                    }
                }
                return flag;
            }


            TunnelSvc.getElines().then(function(data) {
                $scope.elines = data[0].eline;
                if ($scope.elines && $scope.elines.length > 0) {
                    for (var k = 0; k < $scope.elines.length; k++) {
                        $scope['y1564Show' + k] = true;
                        $scope['y1564FormShow' + k] = false;

                        $scope['configTestShow' + k] = false;
                        $scope['pmTestShow' + k] = false;

                        if (isQosExist($scope.elines[k]) === true) {
                            $scope['yPmShow' + k] = true;
                        } else {
                            $scope['yPmShow' + k] = false;
                        }

                    }
                }
                if (data[0].eline !== undefined) {
                    for (var i = 0; i < data[0].eline.length; i++) {
                        countElineLb++;
                        if ('oam' in data[0].eline[i].pw[0]) {}
                        for (var m1 = 0; m1 < data[0].eline[i]['ingress-end-points'].length; m1++) {
                            data[0].eline[i]['ingress-end-points'][m1]['user-label'] = getNodeUserLabelById(data[0].eline[i]['ingress-end-points'][m1]['ne-id']);
                            data[0].eline[i]['ingress-end-points'][m1]['ltp-userlabel'] = getPortUserLabel(data[0].eline[i]['ingress-end-points'][m1]['ne-id'], data[0].eline[i]['ingress-end-points'][m1]['ltp-id']);
                        }
                        for (var n1 = 0; n1 < data[0].eline[i]['egress-end-points'].length; n1++) {
                            data[0].eline[i]['egress-end-points'][n1]['user-label'] = getNodeUserLabelById(data[0].eline[i]['egress-end-points'][n1]['ne-id']);
                            data[0].eline[i]['egress-end-points'][n1]['ltp-userlabel'] = getPortUserLabel(data[0].eline[i]['egress-end-points'][n1]['ne-id'], data[0].eline[i]['egress-end-points'][n1]['ltp-id']);
                        }
                        if (data[0].eline[i].pw) {
                            for (var s1 = 0; s1 < data[0].eline[i].pw.length; s1++) {
                                data[0].eline[i].pw[s1]['ingress-ne-userlabel'] = getNodeUserLabelById(data[0].eline[i].pw[s1]['ingress-ne-id']);
                                data[0].eline[i].pw[s1]['egress-ne-userlabel'] = getNodeUserLabelById(data[0].eline[i].pw[s1]['egress-ne-id']);
                                if (data[0].eline[i].pw[s1].route) {
                                    for (var t1 = 0; t1 < data[0].eline[i].pw[s1].route.length; t1++) {
                                        if (data[0].eline[i].pw[s1].route[t1].xc) {
                                            for (var v1 = 0; v1 < data[0].eline[i].pw[s1].route[t1].xc.length; v1++) {
                                                data[0].eline[i].pw[s1].route[t1].xc[v1]['ne-userlabel'] = getNodeUserLabelById(data[0].eline[i].pw[s1].route[t1].xc[v1]['ne-id']);
                                                if (data[0].eline[i].pw[s1].route[t1].xc[v1]['ingress-ltp-id'] !== undefined) {
                                                    data[0].eline[i].pw[s1].route[t1].xc[v1]['ingress-ltp-userlabel'] = getPortUserLabel(data[0].eline[i].pw[s1].route[t1].xc[v1]['ne-id'], data[0].eline[i].pw[s1].route[t1].xc[v1]['ingress-ltp-id']);
                                                }
                                                if (data[0].eline[i].pw[s1].route[t1].xc[v1]['egress-ltp-id'] !== undefined) {
                                                    data[0].eline[i].pw[s1].route[t1].xc[v1]['egress-ltp-userlabel'] = getPortUserLabel(data[0].eline[i].pw[s1].route[t1].xc[v1]['ne-id'], data[0].eline[i].pw[s1].route[t1].xc[v1]['egress-ltp-id']);
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }


                    }
                }
                for (var j = 0; j < countElineLb; j++) {
                    var obj = {
                        "destinationType": "MEP",
                        "tunnel-id": "",
                        "discovery": "true",
                        "destination": "",
                        "enable": "true",
                        "ne-id": $scope.elines[j].pw[0]['ingress-ne-id'],
                        "nbrOfPkt": 5,
                        "pktLength": 100,
                        "period": "1 SEC",
                        "testTlvPresent": "false",
                        "testTlvType": "Null signal-all zero without CRC-32"
                    };
                    var par = {
                        "ne-id": "",
                        "tunnel-id": "",
                        "lb-id": ""
                    };
                    elineLBObj.push(obj);
                    elineLBPar.push(par);
                }
                $scope.lb2 = elineLBObj;
                $scope.lbparams2 = elineLBPar;
            });
            var tunnelLBObj = [];
            var tunnelLBPar = [];
            TunnelSvc.getTunnels().then(function(data) {
                $scope.tunnels = data[0].tunnel;

                if (data[0].tunnel !== undefined) {
                    for (var i = 0; i < data[0].tunnel.length; i++) {
                        countTunnelLb++;
                        if ('oam' in data[0].tunnel[i].lsp[0]) {

                        }
                        data[0].tunnel[i]['source-ne-userlabel'] = getNodeUserLabelById(data[0].tunnel[i]['source-ne-id']);
                        data[0].tunnel[i]['destination-ne-userlabel'] = getNodeUserLabelById(data[0].tunnel[i]['destination-ne-id']);
                        if (data[0].tunnel[i].lsp) {
                            for (var m2 = 0; m2 < data[0].tunnel[i].lsp.length; m2++) {
                                data[0].tunnel[i].lsp[m2]['ingress-ne-userlabel'] = getNodeUserLabelById(data[0].tunnel[i].lsp[m2]['ingress-ne-id']);
                                data[0].tunnel[i].lsp[m2]['egress-ne-userlabel'] = getNodeUserLabelById(data[0].tunnel[i].lsp[m2]['egress-ne-id']);
                                if (data[0].tunnel[i].lsp[m2].route) {
                                    for (var n2 = 0; n2 < data[0].tunnel[i].lsp[m2].route.length; n2++) {
                                        if (data[0].tunnel[i].lsp[m2].route[n2].xc) {
                                            for (var s2 = 0; s2 < data[0].tunnel[i].lsp[m2].route[n2].xc.length; s2++) {
                                                data[0].tunnel[i].lsp[m2].route[n2].xc[s2]['ne-userlabel'] = getNodeUserLabelById(data[0].tunnel[i].lsp[m2].route[n2].xc[s2]['ne-id']);
                                                if (data[0].tunnel[i].lsp[m2].route[n2].xc[s2]['ingress-ltp-id'] !== undefined) {
                                                    data[0].tunnel[i].lsp[m2].route[n2].xc[s2]['ingress-ltp-userlabel'] = getPortUserLabel(data[0].tunnel[i].lsp[m2].route[n2].xc[s2]['ne-id'], data[0].tunnel[i].lsp[m2].route[n2].xc[s2]['ingress-ltp-id']);
                                                }
                                                if (data[0].tunnel[i].lsp[m2].route[n2].xc[s2]['egress-ltp-id'] !== undefined) {
                                                    data[0].tunnel[i].lsp[m2].route[n2].xc[s2]['egress-ltp-userlabel'] = getPortUserLabel(data[0].tunnel[i].lsp[m2].route[n2].xc[s2]['ne-id'], data[0].tunnel[i].lsp[m2].route[n2].xc[s2]['egress-ltp-id']);
                                                }
                                            }
                                        }

                                    }

                                }
                            }

                        }


                    }
                }

                for (var j = 0; j < countTunnelLb; j++) {
                    var obj = {
                        "destinationType": "MEP",
                        "tunnel-id": "",
                        "discovery": "true",
                        "destination": "",
                        "enable": "true",
                        "ne-id": $scope.tunnels[j].lsp[0]['ingress-ne-id'],
                        "nbrOfPkt": 5,
                        "pktLength": 100,
                        "period": "1 SEC",
                        "testTlvPresent": "false",
                        "testTlvType": "Null signal-all zero without CRC-32"
                    };
                    var par = {
                        "ne-id": "",
                        "tunnel-id": "",
                        "lb-id": ""
                    };
                    tunnelLBObj.push(obj);
                    tunnelLBPar.push(par);
                }
                $scope.lb = tunnelLBObj;
                $scope.lbparams = tunnelLBPar;
            });




            /****************y1564 test start******************/


            $scope.enableY1564 = function(m) {
                $scope['configTestShow' + m] = false;
                $scope['pmTestShow' + m] = false;
                $('#y1564Show' + m).slideToggle("fast");
            };

            $scope.changeY1564Pro = function(enablePro, m) {

                if (enablePro === '1') { //全部
                    $scope['y1564FormShow' + m] = true;
                    $scope['configTestShow' + m] = true;
                    $scope['pmTestShow' + m] = true;
                } else if (enablePro === '2') { //配置
                    $scope['y1564FormShow' + m] = true;
                    $scope['configTestShow' + m] = true;
                    $scope['pmTestShow' + m] = false;
                } else if (enablePro === '3') { //性能
                    $scope['y1564FormShow' + m] = true;
                    $scope['configTestShow' + m] = false;
                    $scope['pmTestShow' + m] = true;
                } else if (enablePro === '0') { //请选择
                    $scope['y1564FormShow' + m] = false;
                    $scope['configTestShow' + m] = false;
                    $scope['pmTestShow' + m] = false;
                }
                if ($scope.elines && $scope.elines.length > 0 && $scope.elines[m].pw && $scope.elines[m].pw[0] && $scope.elines[m].pw[0].qos) {
                    $scope.pmBandwidth = $scope.elines[m].pw[0].qos['qos-a2z-cir'] / 100000;
                }

                // $('#y1564Show' + m).slideToggle("fast");
            };

            $scope.createY1564 = function(index, y1564) {
                if (y1564) {
                    console.log(y1564);
                    var y1564Cpy = $.extend(true, {}, y1564); //copy
                    var input = {};
                    input['service-id'] = $scope.elines[index].id;
                    var srcNeId = $scope.elines[index]['ingress-end-points'][0]['ne-id'];
                    var desNeId = $scope.elines[index]['egress-end-points'][0]['ne-id'];

                    if ($scope['configTestShow' + index] === true && $scope['pmTestShow' + index] === true) {
                        input['type'] = 'both';
                        input['auto-start'] = y1564Cpy.cfg['start'] || y1564Cpy.pm['start'];
                        input['period'] = String(y1564Cpy.cfg['period']);
                        if (y1564Cpy.pm['life'] === '无限' || y1564Cpy.pm['life'] === undefined || y1564Cpy.pm['life'] === null || y1564Cpy.pm['life'] === "") {
                            y1564Cpy.pm['life'] = "0";
                        }
                        input['life'] = y1564Cpy.pm['life'];
                    } else if ($scope['configTestShow' + index] === true && $scope['pmTestShow' + index] === false) {
                        input['type'] = 'throughput';
                        input['auto-start'] = y1564Cpy.cfg['start'];
                        input['period'] = String(y1564Cpy.cfg['period']);
                    } else if ($scope['configTestShow' + index] === false && $scope['pmTestShow' + index] === true) {
                        input['type'] = 'performance';
                        input['auto-start'] = y1564Cpy.pm['start'];
                        if (y1564Cpy.pm['life'] === '无限' || y1564Cpy.pm['life'] === undefined || y1564Cpy.pm['life'] === null || y1564Cpy.pm['life'] === "") {
                            y1564Cpy.pm['life'] = "0";
                        }
                        input['life'] = y1564Cpy.pm['life'];
                    }

                    if ($scope['configTestShow' + index] === true) {
                        var cfg = y1564Cpy.cfg;
                        cfg['type'] = 'throughput';
                        delete cfg['start'];
                        delete cfg['period'];
                        cfg['initial-ne-id'] = srcNeId;
                        cfg['loopback-ne-id'] = desNeId;
                        cfg['frametype'] = 'l2';
                        cfg['bandenable'] = 'false';
                        cfg['task-role'] = 'master';
                        cfg['pktsize'] = String(cfg['pktsize']);
                        if (cfg['pktsizepattern'] === 'random') {
                            cfg['maxsize'] = cfg['pktsize'];
                            delete cfg['pktsize'];
                        }
                        cfg = removeNullPro(cfg);
                        input['throughput-container'] = {
                            'throughput-task': [cfg]
                        };
                    }
                    if ($scope['pmTestShow' + index] === true) {
                        var pm = y1564Cpy.pm;
                        pm['type'] = 'performance';
                        delete pm['start'];
                        pm['initial-ne-id'] = srcNeId;
                        pm['loopback-ne-id'] = desNeId;
                        pm['frametype'] = 'l2';
                        pm['bandenable'] = 'false';
                        pm['pktsize'] = String(pm['pktsize']);
                        if (pm['pktsizepattern'] === 'random') {
                            pm['maxsize'] = pm['pktsize'];
                            delete pm['pktsize'];
                        }
                        delete pm['life'];
                        // delete pm['bandwidth'];
                        pm = removeNullPro(pm);
                        input['performance-container'] = {
                            'performance-task': [pm]
                        };
                    }

                    input['loopback-container'] = {
                        "loopback-task": [{
                            // "index": "3",
                            "loopback-ne-id": desNeId,
                            "flag": "rcsam",
                            // "openflowid": "10",
                            "type": "internal",
                            "flow": "l2",
                            "enable": "true"
                        }]
                    };
                    TunnelSvc.createY1564(input, function(result) {
                        if (result === 'success') {
                            alert($filter('translate')('enable y1564 success'));
                            $state.go('main.tunnel.index', null, { reload: true });
                        } else {
                            alert($filter('translate')('enable y1564 failure'));
                        }
                    });
                }

            };

            $scope.stopY1564 = function(index) {
                console.log(index);
                var input = {};
                input['service-id'] = $scope.elines[index].id;
                TunnelSvc.stopY1564(input);
            };

            $scope.showY1564Result = function(index) {
                $state.go('main.pm.rtpm');
            };

            /****************y1564 test end******************/

            //qos start
            $scope.addAzQos = function(index) {
                $scope['isAddAzVisiable' + index] = false;
                $scope['azShow' + index] = false;
                $scope['azEdit' + index] = true;
            };
            $scope.changeAzQos = function(index) {
                $scope['azShow' + index] = false;
                $scope['azEdit' + index] = true;
            };
            $scope.updateAzQos = function(elineInx, pwInx) {
                //默认只有一个源节点
                var qosParams = {
                    "eline-id": $scope.elines[elineInx].id,
                    "qos-a2z-cir": $scope.elines[elineInx].pw[0].qos['qos-a2z-cir'],
                    "qos-a2z-pir": $scope.elines[elineInx].pw[0].qos['qos-a2z-pir'],
                    "qos-a2z-cbs": $scope.elines[elineInx].pw[0].qos['qos-a2z-cbs'],
                    "qos-a2z-pbs": $scope.elines[elineInx].pw[0].qos['qos-a2z-pbs'],
                    "qos-z2a-cir": $scope.elines[elineInx].pw[pwInx].qos['qos-z2a-cir'],
                    "qos-z2a-pir": $scope.elines[elineInx].pw[pwInx].qos['qos-z2a-pir'],
                    "qos-z2a-cbs": $scope.elines[elineInx].pw[pwInx].qos['qos-z2a-cbs'],
                    "qos-z2a-pbs": $scope.elines[elineInx].pw[pwInx].qos['qos-z2a-pbs']
                };
                if (confirm("Are you sure to add/update Qos ?")) {
                    TunnelSvc.updateQos(qosParams, function(response) {
                        if (response == "Error") {
                            $scope['zaShow' + pwInx] = false;
                            $scope['zaEdit' + pwInx] = true;
                        } else {
                            $scope['azShow' + pwInx] = true;
                            $scope['azEdit' + pwInx] = false;
                            $scope.qos = {};
                            $scope.qos['eline-id'] = $scope.elines[elineInx].id;
                            $scope.qos['qos-a2z-cir'] = $scope.elines[elineInx].pw[0].qos['qos-a2z-cir'];
                            $scope.qos['qos-a2z-cbs'] = $scope.elines[elineInx].pw[0].qos['qos-a2z-cbs'];
                            $scope.qos['qos-a2z-pir'] = $scope.elines[elineInx].pw[0].qos['qos-a2z-pir'];
                            $scope.qos['qos-a2z-pbs'] = $scope.elines[elineInx].pw[0].qos['qos-a2z-pbs'];
                            if ($scope.elines[elineInx].pw[0].qos['qos-z2a-cir']) {
                                $scope.qos['qos-z2a-cir'] = $scope.elines[elineInx].pw[pwInx].qos['qos-z2a-cir'];
                                $scope.qos['qos-z2a-cbs'] = $scope.elines[elineInx].pw[pwInx].qos['qos-z2a-cbs'];
                                $scope.qos['qos-z2a-pir'] = $scope.elines[elineInx].pw[pwInx].qos['qos-z2a-pir'];
                                $scope.qos['qos-z2a-pbs'] = $scope.elines[elineInx].pw[pwInx].qos['qos-z2a-pbs'];
                            }
                        }
                    });
                }
            };
            $scope.removeQos = function(elineInx, pwInx) {
                var delId = { "eline-id": $scope.elines[elineInx].id };
                if (confirm("Are you sure to delete Qos ?")) {
                    TunnelSvc.removeQos(delId, function(response) {
                        if (response == "Error") {} else {
                            $scope['isAddAzVisiable' + pwInx] = true;
                            $scope['isAddZaVisiable' + pwInx] = true;
                            $scope['azShow' + pwInx] = false;
                            $scope['azEdit' + pwInx] = false;
                            $scope['zaShow' + pwInx] = false;
                            $scope['zaEdit' + pwInx] = false;
                            $scope.qos = {};
                            $scope.qos['eline-id'] = $scope.elines[elineInx].id;
                        }
                    });
                }
            };
            $scope.addZaQos = function(index) {
                $scope['isAddZaVisiable' + index] = false;
                $scope['zaShow' + index] = false;
                $scope['zaEdit' + index] = true;
                $scope['azShow' + index] = false;
                $scope['azEdit' + index] = true;
            };
            $scope.changeZaQos = function(elineInx, pwInx) {

                $scope['azShow' + pwInx] = false;
                $scope['azEdit' + pwInx] = true;
                if ($scope.elines[elineInx].pw && $scope.elines[elineInx].pw.length !== 0) {
                    for (var i in $scope.elines[elineInx].pw) {
                        if (Number(i) !== pwInx) {
                            $scope['zaShow' + i] = true;
                            $scope['zaEdit' + i] = false;
                        } else {
                            $scope['zaShow' + pwInx] = false;
                            $scope['zaEdit' + pwInx] = true;
                        }
                    }
                }

            };
            $scope.updateZaQos = function(elineInx, pwInx) {
                //默认只有一个源节点
                var qosParams = {
                    "eline-id": $scope.elines[elineInx].id,
                    "qos-a2z-cir": $scope.elines[elineInx].pw[0].qos['qos-a2z-cir'],
                    "qos-a2z-pir": $scope.elines[elineInx].pw[0].qos['qos-a2z-pir'],
                    "qos-a2z-cbs": $scope.elines[elineInx].pw[0].qos['qos-a2z-cbs'],
                    "qos-a2z-pbs": $scope.elines[elineInx].pw[0].qos['qos-a2z-pbs'],
                    "qos-z2a-cir": $scope.elines[elineInx].pw[pwInx].qos['qos-z2a-cir'],
                    "qos-z2a-pir": $scope.elines[elineInx].pw[pwInx].qos['qos-z2a-pir'],
                    "qos-z2a-cbs": $scope.elines[elineInx].pw[pwInx].qos['qos-z2a-cbs'],
                    "qos-z2a-pbs": $scope.elines[elineInx].pw[pwInx].qos['qos-z2a-pbs']
                };
                if (confirm("Are you sure to add/updateQos ?")) {
                    TunnelSvc.updateQos(qosParams, function(response) {
                        if (response == "Error") {
                            $scope['zaShow' + pwInx] = false;
                            $scope['zaEdit' + pwInx] = true;
                        } else {
                            $scope['zaShow' + pwInx] = true;
                            $scope['zaEdit' + pwInx] = false;
                            $scope['azShow' + pwInx] = true;
                            $scope['azEdit' + pwInx] = false;
                            $scope.qos = {};
                            $scope.qos['eline-id'] = $scope.elines[elineInx].id;
                            $scope.qos['qos-z2a-cir'] = $scope.elines[elineInx].pw[pwInx].qos['qos-z2a-cir'];
                            $scope.qos['qos-z2a-cbs'] = $scope.elines[elineInx].pw[pwInx].qos['qos-z2a-cbs'];
                            $scope.qos['qos-z2a-pir'] = $scope.elines[elineInx].pw[pwInx].qos['qos-z2a-pir'];
                            $scope.qos['qos-z2a-pbs'] = $scope.elines[elineInx].pw[pwInx].qos['qos-z2a-pbs'];
                            if ($scope.elines[elineInx].pw[0].qos['qos-a2z-cir']) {
                                $scope.qos['qos-a2z-cir'] = $scope.elines[elineInx].pw[0].qos['qos-a2z-cir'];
                                $scope.qos['qos-a2z-cbs'] = $scope.elines[elineInx].pw[0].qos['qos-a2z-cbs'];
                                $scope.qos['qos-a2z-pir'] = $scope.elines[elineInx].pw[0].qos['qos-a2z-pir'];
                                $scope.qos['qos-a2z-pbs'] = $scope.elines[elineInx].pw[0].qos['qos-a2z-pbs'];
                            }
                        }

                    });
                }
            };

            //qos end


            $scope.createTunnel = function() {
                $state.go('main.tunnel.create-tunnel');
            };

            $scope.createEline = function() {
                $state.go('main.tunnel.create-eline-module');
            };



            $scope.toggleExpand = function(id, num, tunnelid) {
                if (num === 1) {
                    //protection status 
                    if (id.indexOf('tunnel') > -1) {
                        if ($scope.tunnels[id.replace('tunnel', '')]['lsp'].length === 2) {
                            TunnelSvc.getTunnelProtectionstatus(tunnelid).then(function(data) {
                                console.log(data);
                                if (data.output !== undefined && data.output.result === true) {
                                    if (data.output.master === true && data.output.slave === false) {
                                        $scope.tunnels[id.replace('tunnel', '')]['lsp'][0]['work-status'] = "active";
                                        $scope.tunnels[id.replace('tunnel', '')]['lsp'][1]['work-status'] = "stand by";
                                    } else if (data.output.master === false && data.output.slave === true) {
                                        $scope.tunnels[id.replace('tunnel', '')]['lsp'][0]['work-status'] = "stand by";
                                        $scope.tunnels[id.replace('tunnel', '')]['lsp'][1]['work-status'] = "active";
                                    }
                                }
                            }, function(response) {
                                console.log(response);
                            });
                        } else if ($scope.tunnels[id.replace('tunnel', '')]['lsp'].length === 1) {
                            $scope.tunnels[id.replace('tunnel', '')]['lsp'][0]['work-status'] = "active";
                        }
                    }
                    if (id.indexOf('eline') > -1) {
                        if ($scope.elines[id.replace('eline', '')]['pw'].length === 2) {
                            TunnelSvc.getElineProtectionstatus(tunnelid).then(function(data) {
                                console.log(data);
                                if (data.output !== undefined && data.output.result === true) {
                                    if (data.output.master === true && data.output.slave === false) {
                                        $scope.elines[id.replace('eline', '')]['pw'][0]['work-status'] = "active";
                                        $scope.elines[id.replace('eline', '')]['pw'][1]['work-status'] = "stand by";
                                    } else if (data.output.master === false && data.output.slave === true) {
                                        $scope.elines[id.replace('eline', '')]['pw'][0]['work-status'] = "stand by";
                                        $scope.elines[id.replace('eline', '')]['pw'][1]['work-status'] = "active";
                                    }
                                }
                            }, function(response) {
                                console.log(response);
                            });
                        } else if ($scope.elines[id.replace('eline', '')]['pw'].length === 1) {
                            $scope.elines[id.replace('eline', '')]['pw'][0]['work-status'] = "active";
                        }
                    }

                    $('#btn-' + id).toggleClass('expandIconArrowUp');
                    $('#btn-' + id).toggleClass('expandIconArrowDown');
                    //
                    for (var m in $scope.elines) {
                        if (id == "eline" + m) {
                            if ($scope.elines[m].pw && $scope.elines[m].pw.length !== 0) {

                                for (var n in $scope.elines[m].pw) {
                                    if (('qos' in $scope.elines[m].pw[n]) && ('qos-a2z-cir' in $scope.elines[m].pw[n].qos)) {
                                        $scope['isAddAzVisiable' + n] = false;
                                        $scope['azShow' + n] = true;
                                        $scope['azEdit' + n] = false;
                                    } else {
                                        $scope['isAddAzVisiable' + n] = true;
                                        $scope['azShow' + n] = false;
                                        $scope['azEdit' + n] = false;
                                    }

                                    if (('qos' in $scope.elines[m].pw[n]) && ('qos-z2a-cir' in $scope.elines[m].pw[n].qos)) {
                                        $scope['isAddZaVisiable' + n] = false;
                                        $scope['zaShow' + n] = true;
                                        //                                        //只有最后一个宿节点才显示修改qos的按钮
                                        //                                        if (n !== $scope.elines[m].pw.length - 1) {
                                        //                                            $scope['QosEdit' + n] = true;
                                        //                                        } else {
                                        //                                            $scope['QosEdit' + n] = false;
                                        //                                        }
                                        $scope['zaEdit' + n] = false;
                                    } else {
                                        $scope['isAddZaVisiable' + n] = true;
                                        $scope['zaShow' + n] = false;
                                        $scope['zaEdit' + n] = false;
                                    }
                                }


                            }



                        }

                    }
                } else if (num === 3) {
                    //        for(var n in $scope.tunnels){
                    //          if(id=="tunnel"+n){
                    //            if($scope.tunnels[n].lsp){
                    //              if($scope.tunnels[n].lsp.oam==undefined){
                    //                $scope.oamShow=false;
                    //              }
                    //            } 
                    //          }         
                    //        }
                } else {
                    $('#btn-' + id).toggleClass('iconOpen');
                    $('#btn-' + id).toggleClass('iconClose');
                }
                $('#' + id).slideToggle("fast");
            };

            $scope.removeEline = function(id, index) {
                if (confirm("Are you sure to delete " + id + "?")) {
                    TunnelSvc.removeEline(id, index);
                }
            };

            $scope.removeTunnel = function(name, id, index) {
                if (confirm("Are you sure to delete " + name + "?")) {
                    TunnelSvc.removeTunnel(id, index);
                }
            };



            //lb start
            //    $scope.lb2={};
            //    $scope.lb2['ne-id']=[];
            //    $scope.lb2.nbrOfPkt=5;
            //    $scope.lb2.pktLength=100;
            //    $scope.lb2.period=[];
            //    $scope.lbparams2=[];
            var lb2Ids = {};
            $scope.lbresult2 = [];
            $scope.createLb2 = function(m) {
                //      $scope.lb2[m].destinationType="MEP";
                $scope.lb2[m]['eline-id'] = $scope.elines[m].id;
                //      $scope.lb2[m].discovery="true";
                if ($scope.lb2[m]['pwType'] === "work") {
                    $scope.lb2[m].destination = $scope.elines[m].pw[0].oam['meg-id'];
                } else if ($scope.lb2[m]['pwType'] === "protection") {
                    if ($scope.elines[m].pw[1] !== undefined && $scope.elines[m].pw[1].oam['meg-id'] !== undefined) {
                        $scope.lb2[m].destination = $scope.elines[m].pw[1].oam['meg-id'];
                    } else {
                        alert("Can't Start LB ! The protection pw has no oam params !");
                    }
                }
                //      $scope.lb2[m].enable=true;
                //      $scope.lb2[m]['lb-id']=0;
            };
            $scope.createLbParams2 = function(m) {
                $scope.lbparams2[m]['ne-id'] = $scope.lb2[m]['ne-id'];
                $scope.lbparams2[m]['eline-id'] = $scope.elines[m].id;
                //      if(lbId2.split(",")[0]==String(m)){
                if ($scope.lb2[m]['pwType'] === "work") {
                    $scope.lbparams2[m]['meg-id'] = $scope.elines[m].pw[0].oam['meg-id'];
                } else if ($scope.lb2[m]['pwType'] === "protection") {
                    $scope.lbparams2[m]['meg-id'] = $scope.elines[m].pw[1].oam['meg-id'];
                }
                if (lb2Ids[m + ''] !== undefined) {
                    $scope.lbparams2[m]['lb-id'] = Number(lb2Ids[m + '']);
                }
            };

            $scope.startLb2 = function(m) {
                var packCount2 = 0;
                //      var lbId2 = "0";
                $scope.showEdit2 = true;
                $scope['showResult2' + m] = false;
                $scope.createLb2(m);
                var lbStartPar2 = {};
                $.extend(true, lbStartPar2, $scope.lb2[m]);
                delete lbStartPar2['pwType'];
                TunnelSvc.startLb(lbStartPar2, function(response) {
                    if (response == "Error") {
                        if (confirm("Start lb failed : Request returns error")) {
                            $scope['enabledEnd2' + m] = false;
                            $scope['startEnable2' + m] = false;
                            //            $scope.startEnable2=false;
                            $scope['canEdit2' + m] = false;
                            $scope['canTLVEdit2' + m] = false;
                        }
                    } else {
                        lb2Ids[m + ''] = response;
                        //          lbId2=m+","+response;
                        $scope.lbresult2[m] = {
                            'lb-resultOK': "",
                            'lb-nbrOfLbrIn': 0,
                            'lb-nbrOfLbrInOutOfOrder': 0,
                            'lb-nbrOfLbrBadMsdu': 0
                        };
                        $scope['showResult2' + m] = true;
                        //          $scope['startEnable2'+m]=true;
                        //          $scope['enabledEnd2'+m]=true;
                        lateExe2 = function() {
                            if (packCount2 < $scope.lb2[m].nbrOfPkt) {
                                setTimeout(function() {
                                    $scope.$apply(function() {
                                        $scope['canEdit2' + m] = false;
                                        $scope['canTLVEdit2' + m] = false;
                                        $scope['startEnable2' + m] = true;
                                        $scope['enabledEnd2' + m] = true;
                                        $scope.createLbParams2(m);
                                        var lbResultPar2 = {};
                                        $.extend(true, lbResultPar2, $scope.lbparams2[m]);
                                        delete lbResultPar2['pwType'];
                                        TunnelSvc.getLbStatus(lbResultPar2, function(data) {
                                            $scope.lbresult2[m] = data.output;

                                        });
                                    });
                                    lateExe2();
                                }, 3000);
                            } else {
                                $scope['startEnable2' + m] = false;
                                $scope['enabledEnd2' + m] = false;
                            }
                            packCount2++;
                        };
                        lateExe2();
                    }
                });
            };
            $scope.endLb2 = function(m) {

                $scope.showEdit2 = true;

                $scope['canEdit2' + m] = false;
                $scope['canTLVEdit2' + m] = false;
                $scope.createLbParams2(m);
                var lbResultPar2 = {};
                $.extend(true, lbResultPar2, $scope.lbparams2[m]);
                delete lbResultPar2['pwType'];
                TunnelSvc.lbStop(lbResultPar2, function(response) {
                    if (response == "sccess") {
                        packCount2 = 10000;
                        $scope['enabledEnd2' + m] = false;
                        $scope['startEnable2' + m] = false;
                    } else if (response == "error") {
                        console.log("can not stop lb");
                        $scope['enabledEnd2' + m] = true;
                        $scope['startEnable2' + m] = true;
                    }
                });
                TunnelSvc.getLbStatus(lbResultPar2, function(data) {
                    $scope.lbresult2[m] = data.output;
                    $scope['showResult2' + m] = true;
                });

            };
            $scope.tlvPresentChange2 = function(x) {
                if (x == "true") {
                    $scope.canTLVEdit2 = false;
                } else {
                    $scope.canTLVEdit2 = true;
                }
            };
            $scope.setLBShow2 = function(m) {
                if ('oam' in $scope.elines[m].pw[0]) {
                    return true;
                } else {
                    return false;
                }
            };
            $scope.DelLBResult2 = function(m) {
                $scope.endLb2(m);
                var lbResultPar2 = {};
                $.extend(true, lbResultPar2, $scope.lbparams2[m]);
                delete lbResultPar2['pwType'];
                TunnelSvc.lbDelete(lbResultPar2, function(data) {
                    if (data === "success") {
                        $scope['showResult2' + m] = false;
                    }
                });
                $scope.setLBEditShow2 = function(m) {
                    return false;
                };
                return false;
            };
            $scope.showEditLB2 = function(m) {
                $('#tunnelLb2' + m).slideToggle("fast");
            };


            //    $scope.lb['ne-id']=[];
            //    $scope.lb.nbrOfPkt=5;
            //    $scope.lb.pktLength=100;
            //    $scope.lb.period=[];
            //    $scope.lbparams=[];
            var lbIds = {};
            $scope.lbresult = [];
            $scope.createLb = function(m) {
                //      $scope.lb=[];
                //      $scope.lb[m].destinationType="MEP";
                $scope.lb[m]['tunnel-id'] = $scope.tunnels[m].id;
                //      $scope.lb[m].discovery="true";
                if ($scope.lb[m]['lspType'] === "work") {
                    $scope.lb[m].destination = $scope.tunnels[m].lsp[0].oam['meg-id'];
                } else if ($scope.lb[m]['lspType'] === "protection") {
                    if ($scope.tunnels[m].lsp[1] !== undefined && $scope.tunnels[m].lsp[1].oam['meg-id'] !== undefined) {
                        $scope.lb[m].destination = $scope.tunnels[m].lsp[1].oam['meg-id'];
                    } else {
                        alert("Can't Start LB ! The protection lsp has no oam params !");
                    }
                }

                //      $scope.lb[m].enable="true";
                //      $scope.lb[m]['lb-id']="";
            };
            $scope.createLbParams = function(m) {
                $scope.lbparams[m]['ne-id'] = $scope.lb[m]['ne-id'];
                $scope.lbparams[m]['tunnel-id'] = $scope.tunnels[m].id;
                //         if(lbId.split(",")[0]==String(m)){
                if (lbIds[m + ''] !== undefined) {
                    $scope.lbparams[m]['lb-id'] = Number(lbIds[m + '']);
                }
                if ($scope.lb[m]['lspType'] === "work") {
                    $scope.lbparams[m]['meg-id'] = $scope.tunnels[m].lsp[0].oam['meg-id'];
                } else if ($scope.lb[m]['lspType'] === "protection") {
                    $scope.lbparams[m]['meg-id'] = $scope.tunnels[m].lsp[1].oam['meg-id'];
                }
            };

            $scope.startLb = function(m) {
                //      var lbId = "0";
                var packCount = 0;
                $scope.showEdit = true;
                $scope['showResult' + m] = false;
                $scope.createLb(m);
                $scope['startEnable' + m] = true;
                var lbStartPar = {};
                $.extend(true, lbStartPar, $scope.lb[m]);
                delete lbStartPar['lspType'];
                TunnelSvc.startLb(lbStartPar, function(response) {
                    if (response == "Error") {
                        if (confirm("Start lb failed : Request returns error")) {
                            $scope['enabledEnd' + m] = false;
                            $scope['startEnable' + m] = false;
                            $scope['canEdit' + m] = false;
                            $scope['canTLVEdit' + m] = false;
                            //Test
                            //            $scope['showResult'+m]=true;
                        }
                    } else {
                        lbIds[m + ''] = response;
                        //          lbId=m+","+response;
                        $scope.lbresult[m] = {
                            'lb-resultOK': "",
                            'lb-nbrOfLbrIn': 0,
                            'lb-nbrOfLbrInOutOfOrder': 0,
                            'lb-nbrOfLbrBadMsdu': 0
                        };
                        $scope['showResult' + m] = true;
                        lateExe = function() {
                            if (packCount < $scope.lb[m].nbrOfPkt) {
                                setTimeout(function() {
                                    $scope.$apply(function() {
                                        $scope['canEdit' + m] = false;
                                        $scope['canTLVEdit' + m] = false;
                                        $scope['startEnable' + m] = true;
                                        //                  $scope.startEnable=false;
                                        $scope['enabledEnd' + m] = true;
                                        $scope.createLbParams(m);
                                        var lbResultPar = {};
                                        $.extend(true, lbResultPar, $scope.lbparams[m]);
                                        delete lbResultPar['lspType'];
                                        TunnelSvc.getLbStatus(lbResultPar, function(data) {
                                            $scope.lbresult[m] = data.output;
                                        });
                                    });
                                    lateExe();
                                }, 3000);
                            } else {
                                $scope['startEnable' + m] = false;
                                $scope['enabledEnd' + m] = false;
                            }
                            packCount++;
                        };
                        lateExe();
                    }
                });
            };
            $scope.endLb = function(m) {
                $scope['canEdit' + m] = false;
                $scope['canTLVEdit' + m] = false;
                $scope.showEdit = true;
                $scope.createLbParams(m);
                var lbResultPar = {};
                $.extend(true, lbResultPar, $scope.lbparams[m]);
                delete lbResultPar['lspType'];
                TunnelSvc.lbStop(lbResultPar, function(response) {
                    if (response == "success") {
                        packCount = 10000;
                        $scope['enabledEnd' + m] = false;
                        //          
                        $scope['startEnable' + m] = false;
                    } else if (response == "error") {
                        console.log("can not stop lb");
                        $scope['enabledEnd' + m] = true;
                        $scope['startEnable' + m] = true;
                    }
                });

                TunnelSvc.getLbStatus(lbResultPar, function(data) {
                    $scope.lbresult[m] = data.output;
                    $scope['showResult' + m] = true;
                });
            };
            $scope.tlvPresentChange = function(x) {
                if (x == "true") {
                    $scope.canTLVEdit = false;
                } else {
                    $scope.canTLVEdit = true;
                }
            };
            $scope.setLBShow = function(m) {
                if ('oam' in $scope.tunnels[m].lsp[0]) {
                    return true;
                } else {
                    return false;
                }
            };
            $scope.DelLBResult = function(m) {
                $scope.endLb(m);
                var lbResultPar = {};
                $.extend(true, lbResultPar, $scope.lbparams[m]);
                delete lbResultPar['lspType'];
                TunnelSvc.lbDelete(lbResultPar, function(data) {
                    if (data === "success") {
                        $scope['showResult' + m] = false;
                    }
                });
                $scope.setLBEditShow = function(m) {
                    return false;
                };
                return false;
            };
            $scope.showEditLB = function(m) {
                $('#tunnelLb' + m).slideToggle("fast");
            };
            //LB end


            $scope.lmdmsend = function(id, type) {
                TunnelSvc.LMDMSend(id, type, function(success, serviceId) {
                    if (success) {
                        if (type.indexOf('stop') < 0) {
                            if (type.indexOf('lm') !== -1) {
                                TunnelSvc.LMDMAddBusiness(serviceId, 'lm');
                            }
                            if (type.indexOf('dm') !== -1) {
                                TunnelSvc.LMDMAddBusiness(serviceId, 'dm');
                            }
                        } else {
                            if (type.indexOf('lm') !== -1) {
                                TunnelSvc.LMDMDeleteBusiness(serviceId, 'lm');
                            }
                            if (type.indexOf('dm') !== -1) {
                                TunnelSvc.LMDMDeleteBusiness(serviceId, 'dm');
                            }
                        }
                    }
                });
            };

            $scope.forcedProtect = function(type, id, tunnelId) {

                if (type == 'eline') {
                    TunnelSvc.forcedPro(tunnelId, $scope.elines[id]['ps-command-type']);

                } else if (type == 'tunnel') {
                    TunnelSvc.forcedPro(tunnelId, $scope.tunnels[id]['ps-command-type']);
                }
            };

        });

        //Create Tunnel
        tunnel.register.controller('CreateTunnelCtrl', function($scope, $filter, TunnelSvc) {

            var curTunnelId = TunnelSvc.getCurTunnelId();
            var curLspId = TunnelSvc.getCurLspId();
            var curMepId = TunnelSvc.getCurMepId();
            $scope.tunnel = { id: null, name: null };

            $scope.tunnel.lsp = [{
                id: null,
                route: [{
                    xc: [{},
                        {}
                    ]
                }]
            }];
            $scope.protctionShow = false;
            $scope.oamshow = [false];
            $scope.allPorts = [];
            $scope.ports = [];

            function filterNodes(nodes) {
                var fNodes = [];
                if (nodes && nodes.length !== 0) {

                    for (var i = 0; i < nodes.length; i++) {
                        var node = nodes[i];
                        if (node.id.indexOf('openflow') !== -1) {
                            fNodes.push(node);
                        }
                    }
                }
                return fNodes;
            }

            $scope.getPortList = function(node) {

                $scope.portList = node['node-connector'];
                for (var i = 0; i < $scope.portList.length; i++) {
                    $scope.portList[i]['userlabel'] = $scope.portList[i]['sdn-inventory:user-label'];
                }

            };

            var extSwitchs = [];
            var extPorts = [];

            //通过接口获取的extNode的数据结构与node的数据结构不同　extNode：node-connects　node：node-connector
            function extNodeProcess(extNodeList) {
                var extNodes = [];
                if (extNodeList && extNodeList.length !== 0) {
                    for (var i = 0; i < extNodeList.length; i++) {
                        extNodeList[i]['userlabel'] = extNodeList[i]['user-label'];
                        //孤立外部节点没有node-connects属性
                        if (extNodeList[i].hasOwnProperty('node-connects') === false) {
                            var conn = {};
                            conn['id'] = extNodeList[i].id + ":UNKNOWN";
                            conn['ltp-id'] = conn['id'];
                            conn['sdn-inventory:user-label'] = conn['id'];
                            extNodeList[i]['node-connector'] = [conn];
                        } else {
                            for (var j = 0; j < extNodeList[i]['node-connects'].length; j++) {
                                var ltpId = extNodeList[i]['node-connects'][j]['ltp-id'];
                                if (ltpId.lastIndexOf(":") === -1) {
                                    //外部节点ltp-id不带冒号
                                    ltpId = ltpId + ":UNKNOWN";
                                } else {
                                    //外部节点ltp-id带冒号
                                    ltpId = ltpId.substring(0, ltpId.lastIndexOf(":") + 1) + "UNKNOWN";
                                }
                                extNodeList[i]['node-connects'][j]['ltp-id'] = ltpId;
                                extNodeList[i]['node-connects'][j]['id'] = ltpId;
                                var loc = extNodeList[i]['node-connects'][j]['user-label'].indexOf(extNodeList[i].id);
                                if (loc !== -1) {
                                    extNodeList[i]['node-connects'][j]['user-label'] = extNodeList[i]['node-connects'][j]['user-label'].substring(loc + extNodeList[i].id.length + 1);
                                } else {
                                    extNodeList[i]['node-connects'][j]['user-label'] = "UNKNOWN";
                                }
                                extNodeList[i]['node-connects'][j]['sdn-inventory:user-label'] = extNodeList[i]['node-connects'][j]['user-label'];
                            }
                            extNodeList[i]['node-connector'] = extNodeList[i]['node-connects'];

                        }

                    }
                }
                extNodes = extNodeList;
                return extNodes;
            }

            //获取所有外部node
            TunnelSvc.getExtNodes(function(response) {

                $scope.extNodeList = extNodeProcess(response);

                var tmpPort = {};
                var tmpPortStrList = [];
                if ($scope.extNodeList && $scope.extNodeList.length !== 0) {
                    for (var c = 0; c < $scope.extNodeList.length; c++) {
                        // extSwitchs.push({ 'id': response[c].id });
                        extSwitchs.push($scope.extNodeList[c]);
                    }
                }
            });

            var portStrList = [];
            var curSwitchs = TunnelSvc.getCurrentSwitchs();
            // if (curSwitchs != null) {
            //     curSwitchs.then(function(data) {
            //         $scope.nodes = data[0].node;
            //         $scope.nodes = filterNodes($scope.nodes);
            //     });
            // } else {
            //     TunnelSvc.getSwitchs().then(function(data) {
            //         $scope.nodes = data[0].node;
            //         $scope.nodes = filterNodes($scope.nodes);
            //     });
            // }

            if (curSwitchs != null) {
                curSwitchs.then(function(data) {
                    $scope.nodes = data[0].node;
                    $scope.nodes = filterNodes($scope.nodes);
                    for (var i in $scope.nodes) {
                        $scope.nodes[i]['userlabel'] = $scope.nodes[i]['sdn-inventory:user-label'];
                        for (var j in $scope.nodes[i]['node-connector']) {
                            port = {};
                            port['id'] = $scope.nodes[i]['node-connector'][j].id;
                            port['userlabel'] = $scope.nodes[i]['node-connector'][j]['sdn-inventory:user-label'];

                            if (portStrList.indexOf(port['id']) === -1) {
                                portStrList.push(port['id']);
                                $scope.allPorts.push(port);
                            }
                            //
                        }
                    }
                    //将外部节点列表添加到allPorts内
                    $scope.allPorts = $scope.allPorts.concat(extPorts);
                    $scope.nodes = $scope.nodes.concat(extSwitchs);
                });
            } else {
                TunnelSvc.getSwitchs().then(function(data) {
                    $scope.nodes = data[0].node;
                    $scope.nodes = filterNodes($scope.nodes);

                    for (var i in $scope.nodes) {
                        $scope.nodes[i]['userlabel'] = $scope.nodes[i]['sdn-inventory:user-label'];
                        for (var j in $scope.nodes[i]['node-connector']) {
                            port = {};
                            port['id'] = $scope.nodes[i]['node-connector'][j].id;
                            port['userlabel'] = $scope.nodes[i]['node-connector'][j]['sdn-inventory:user-label'];
                            if (portStrList.indexOf(port['id']) === -1) {
                                portStrList.push(port['id']);
                                $scope.allPorts.push(port);
                            }
                            //
                        }
                    }
                    //将外部节点列表添加到allPorts内
                    $scope.allPorts = $scope.allPorts.concat(extPorts);
                    $scope.nodes = $scope.nodes.concat(extSwitchs);
                });
            }



            $scope.createTunnel = function(tunnel) {
                //      countCreateTunnel++;
                tunnel.id = String(tunnel.id);
                tunnel.direction = "bidirection";
                tunnel['tunnel-type'] = "linearMPLS";
                tunnel['admin-status'] = "admin-up";
                tunnel['operate-status'] = "operate-up";
                for (var m in tunnel.lsp) {
                    tunnel.lsp[m].id = String(tunnel.lsp[m].id);
                    tunnel.lsp[m].direction = "bidirection";
                    tunnel.lsp[m]['admin-status'] = "admin-up";
                    tunnel.lsp[m]['operate-status'] = "operate-up";
                    tunnel.lsp[m].route[0].id = "1";
                    tunnel.lsp[m].route[0]['layer-rate'] = "lsp";
                    if (tunnel.lsp[m].oam != null) {
                        var tmpNum = Math.round(Math.random() * 10000);
                        while (tmpNum === 0) {
                            tmpNum = Math.round(Math.random() * 10000);
                        }
                        tunnel.lsp[m].oam['meg-id'] = tmpNum;
                        tunnel.lsp[m].oam.meps = [{}, {}];
                        tunnel.lsp[m].oam.meps[0].id = 1;
                        tunnel.lsp[m].oam.meps[0].name = 1;
                        tunnel.lsp[m].oam.meps[1].id = 2;
                        tunnel.lsp[m].oam.meps[1].name = 2;
                    }
                }
                if (tunnel.protection != null && $scope.curProType !== undefined) {
                    tunnel['protection']['snc-id'] = "1";
                    tunnel.protection['layer-rate'] = "lsp";
                    //      tunnel.protection['linear-protection-type'] = "path-protection-1-to-1";
                    tunnel.protection['linear-protection-type'] = $scope.curProType;
                    tunnel.protection['linear-protection-protocol'] = "APS";
                    tunnel.protection['switch-mode'] = "double-end-switch";
                }
                TunnelSvc.createTunnel(tunnel);
            };

            $scope.toggle = function(id) {
                $('#btn-' + id).toggleClass('expandIconArrowUp');
                $('#btn-' + id).toggleClass('expandIconArrowDown');
                $('#' + id).slideToggle("fast");
            };

            $scope.addLsp = function() {
                ++curLspId;
                var lsp = {
                    id: "",
                    route: [{
                        xc: [{},
                            {}
                        ]
                    }]
                };
                $scope.oamshow.push(false);
                $scope.tunnel.lsp.push(lsp);
            };

            $scope.addXc = function(idx) {
                var obj = {};
                $scope.tunnel.lsp[idx].route[0].xc.push(obj);
            };

            $scope.removeLsp = function(idx) {
                curLspId--;
                $scope.tunnel.lsp.splice(idx, 1);
                var length = $scope.tunnel.lsp.length;
                for (var i in $scope.tunnel.lsp) {
                    $scope.tunnel.lsp[i].id = curLspId - length + 1 + i;
                }
            };

            $scope.removeXc = function(pidx, idx) {
                $scope.tunnel.lsp[pidx].route[0].xc.splice(idx, 1);
            };

            $scope.changeXc = function(id, num) {
                //            if($scope.tunnel.lsp[id]['lsp-type']==='pepe'){
                //                if(num === 0){
                //                    $scope.tunnel.lsp[id].route[0].xc[num]['ne-id'] = $scope.tunnel.lsp[id]['ingress-ne-id'];
                //                }else{
                //                    $scope.tunnel.lsp[id].route[0].xc[num]['ne-id'] = $scope.tunnel.lsp[id]['egress-ne-id'];
                //                }
                //            }
                //      $scope.changeLtp(id,num);
            };

            $scope.addProtection = function() {
                while ($scope.tunnel.lsp.length < 2) {
                    $scope.addLsp();
                }
                $scope.protctionShow = true;
            };

            $scope.removeProtection = function() {
                for (var i in $scope.tunnel.lsp) {
                    if (i > 0) {
                        $scope.tunnel.lsp.splice(i, 1);
                    }
                }
                delete $scope.tunnel.protection;
                $scope.protctionShow = false;
            };

            $scope.addOam = function(id) {
                $scope.oamshow[id] = true;
                if ($scope.tunnel.lsp[id].oam !== null && $scope.tunnel.lsp[id].oam !== undefined) {
                    alert("oam is already in this lsp!");
                } else {
                    $scope.tunnel.lsp[id].oam = {
                        //             "meg-id": ++curMepId,
                        //             "cc-exp": "CS7",
                        //             meps: [{},
                        //                    {}]
                    };
                }
            };

            $scope.removeOam = function(id) {
                $scope.oamshow[id] = false;
                //      curMepId--;
                if ($scope.tunnel.lsp[id].oam !== null && $scope.tunnel.lsp[id].oam !== undefined) {
                    delete $scope.tunnel.lsp[id].oam;
                } else {
                    alert("oam is not in this lsp!");
                }
            };

            $scope.addMeps = function(id) {
                var obj = {};
                $scope.tunnel.lsp[id].oam.meps.push(obj);
            };

            $scope.removeMeps = function(pid, id) {
                $scope.tunnel.lsp[pid].oam.meps.splice(id, 1);
            };

            $scope.changeLtp = function(pid, id) {
                var nodeId = $scope.tunnel.lsp[pid].route[0].xc[id]['ne-id'];
                //      if(id === 0){
                //        $scope.tunnel.lsp[pid]['ingress-ne-id'] = nodeId;
                //      }else if(id === 1){
                //        $scope.tunnel.lsp[pid]['egress-ne-id'] = nodeId;
                //      }
                if ($scope.ports[pid] == null) {
                    $scope.ports[pid] = [];
                }
                var node = _.find($scope.nodes, function(entry) {
                    if (entry.id == nodeId) {
                        return entry;
                    }
                });
                $scope.ports[pid][id] = node['node-connector'];
                for (var i = 0; i < $scope.ports[pid][id].length; i++) {
                    $scope.ports[pid][id][i]['userlabel'] = $scope.ports[pid][id][i]['sdn-inventory:user-label'];
                    if ($scope.ports[pid][id][i]['userlabel'].indexOf('UNKNOWN') !== -1) {
                        $scope.ports[pid][id][i]['userlabel'] = 'UNKNOWN';
                    }
                }
            };

            $scope.changeLspType = function(id) {
                //        if($scope.tunnel.lsp[id]['lsp-type']==='pepe'){
                //            console.log(id);
                //            $scope.tunnel.lsp[id].route[0].xc[0]['ne-id'] = $scope.tunnel.lsp[id]['ingress-ne-id'];
                //            $scope.tunnel.lsp[id].route[0].xc[1]['ne-id'] = $scope.tunnel.lsp[id]['egress-ne-id'];
                //            $scope.changeLtp(id,0);
                //            $scope.changeLtp(id,1);
                //        }else{
                $scope.tunnel.lsp[id].route[0].xc[0]['ne-id'] = "";
                $scope.tunnel.lsp[id].route[0].xc[1]['ne-id'] = "";
                $scope.ports[id] = [
                    [],
                    []
                ];
                //        }
            };

            //***********************************************自动创建+BFD+PW冗余 start************************************************//

            $scope.proTypes = [{ id: 'path-protection-1-to-1' }, { id: '1:1 trail protection' }, { id: '1:1 trail protection' }, { id: 'path-protection-1-plus-1' }, { id: 'permanent-1-to-1-protection' }, { id: 'permanent-1-plus-1-protection' }];

            $scope.lspCreateTypes = [{ id: 'Auto Create' }, { id: 'Manually Create' }];

            $scope.xcListShow = true;

            $scope.lspCreShow = false;

            // 自动创建
            $scope.lspCreateType = function(type) {
                if (type == "Auto Create") {
                    $scope.xcListShow = false;
                } else if (type == "Manually Create") {
                    $scope.xcListShow = true;
                }
                console.log(type);
            };

            //永久保护
            $scope.selProtectType = function(type) {
                //    var type = $scope.proTypes[parIndex]['id'];
                console.log(type);
                if (type == "permanent-1-to-1-protectio") {
                    $scope.lspCreShow = true;
                }
            };

            //***********************************************自动创建+BFD+PW冗余 end************************************************//


        });




        tunnel.register.controller('CreateElineCtrl',
            function($scope, $state, $filter, TunnelSvc) {
                $scope.y1564CfgChartShow = false;

                $scope.eline = {};
                //var pw = {route:[{xc:[{},{}]}]};
                $scope.eline.pw = [{
                    'role': 'master',
                    "tunnel-ids": [{}],
                    route: [{
                        xc: [{},
                            {}
                        ]
                    }]
                }];
                $scope.eline['ingress-end-points'] = [{}];
                $scope.eline['egress-end-points'] = [{}];
                $scope.tunnelIds = [];
                $scope.ports = [];
                $scope.allPorts = [];
                $scope.elineOamshow = [false];

                $scope.acActionTypes = [
                    { id: "Keep" },
                    { id: "Pop" },
                    { id: "Push" }
                ];

                $scope.y1564Show = true;
                $scope.y1564ExpanderShow = true;
                $scope.y1564BtnShow = false;

                $scope.addY1564TestShow = false;
                $scope.y1564TestShow = false;
                $scope.configTestShow = false;
                $scope.configTestExpand = false;

                $scope.pmTestShow = false;
                $scope.pmTestExpand = false;

                $scope.yconfigTestShow = false;
                $scope.ypmTestShow = false;

                $scope.enableProShow = false;

                $scope.enableProList = [
                    { 'id': '全部', 'value': '1' },
                    { 'id': '配置', 'value': '2' },
                    { 'id': '性能', 'value': '3' }
                ];

                function removeNullPro(obj) {
                    if (obj && $.isEmptyObject(obj) === false) {
                        for (var pro in obj) {
                            if (!obj[pro] || obj[pro] === null || obj[pro] === "") {
                                delete obj[pro];
                            }
                        }
                    }
                    return obj;
                }

                $scope.changeY1564 = function(enableY1564) {
                    if (enableY1564 === '1') {
                        if ('pw' in $scope.eline && $scope.eline.pw.length !== 0) {
                            if ('qos' in $scope.eline.pw[0] === false) {
                                $scope.enableProList = [
                                    { 'id': '性能', 'value': '3' }
                                ];
                            }
                            $scope.enableProShow = true;
                        }
                    } else {
                        $scope.enableProShow = false;
                        $scope.yconfigTestShow = false;
                        $scope.ypmTestShow = false;
                    }
                };

                $scope.changeY1564Pro = function(enablePro) {
                    if (enablePro === '1') {
                        $scope.yconfigTestShow = true;
                        $scope.ypmTestShow = true;
                    } else if (enablePro === '2') {
                        $scope.yconfigTestShow = true;
                        $scope.ypmTestShow = false;
                    } else if (enablePro === '3') {
                        $scope.yconfigTestShow = false;
                        $scope.ypmTestShow = true;
                    } else if (enablePro === '0') {
                        $scope.yconfigTestShow = false;
                        $scope.ypmTestShow = false;
                    }
                    if ($scope.eline && $scope.eline.pw && $scope.eline.pw[0] && $scope.eline.pw[0].qos) {
                        $scope.pmBandwidthModal = $scope.eline.pw[0].qos['qos-a2z-cir'] / 100000;
                    }
                };

                $scope.createModalY1564 = function(y1564) {
                    if (y1564) {
                        console.log(y1564);
                        var y1564Cpy = $.extend(true, {}, y1564); //copy
                        var srcNeId = $scope.eline['ingress-end-points'][0]['ne-id'];
                        var desNeId = $scope.eline['egress-end-points'][0]['ne-id'];

                        var input = {};
                        input['service-id'] = $scope.eline.id;

                        if ($scope.yconfigTestShow === true && $scope.ypmTestShow === true) {
                            input['type'] = 'both';
                            input['auto-start'] = y1564Cpy.cfg['start'] || y1564Cpy.pm['start'];
                            input['period'] = String(y1564Cpy.cfg['period']);
                            if (y1564Cpy.pm['life'] === '无限' || y1564Cpy.pm['life'] === undefined || y1564Cpy.pm['life'] === null || y1564Cpy.pm['life'] === "") {
                                y1564Cpy.pm['life'] = "0";
                            }
                            input['life'] = y1564Cpy.pm['life'];
                        } else if ($scope.yconfigTestShow === true && $scope.ypmTestShow === false) {
                            input['type'] = 'throughput';
                            input['auto-start'] = y1564Cpy.cfg['start'];
                            input['period'] = String(y1564Cpy.cfg['period']);
                        } else if ($scope.yconfigTestShow === false && $scope.ypmTestShow === true) {
                            input['type'] = 'performance';
                            input['auto-start'] = y1564Cpy.pm['start'];
                            if (y1564Cpy.pm['life'] === '无限' || y1564Cpy.pm['life'] === undefined || y1564Cpy.pm['life'] === null || y1564Cpy.pm['life'] === "") {
                                y1564Cpy.pm['life'] = "0";
                            }
                            input['life'] = y1564Cpy.pm['life'];
                        }
                        if ($scope.yconfigTestShow === true) {
                            var cfg = y1564Cpy.cfg;
                            cfg['type'] = 'throughput';
                            delete cfg['start'];
                            delete cfg['period'];
                            cfg['initial-ne-id'] = srcNeId;
                            cfg['loopback-ne-id'] = desNeId;
                            cfg['frametype'] = 'l2';
                            cfg['bandenable'] = 'false';
                            cfg['task-role'] = 'master';
                            cfg['pktsize'] = String(cfg['pktsize']);
                            if (cfg['pktsizepattern'] === 'random') {
                                cfg['maxsize'] = cfg['pktsize'];
                                delete cfg['pktsize'];
                            }
                            cfg = removeNullPro(cfg);
                            input['throughput-container'] = {
                                'throughput-task': [cfg]
                            };
                        }
                        if ($scope.ypmTestShow === true) {
                            var pm = y1564Cpy.pm;
                            pm['type'] = 'performance';
                            delete pm['start'];
                            pm['initial-ne-id'] = srcNeId;
                            pm['loopback-ne-id'] = desNeId;
                            pm['frametype'] = 'l2';
                            pm['bandenable'] = 'false';
                            pm['pktsize'] = String(pm['pktsize']);
                            if (pm['pktsizepattern'] === 'random') {
                                pm['maxsize'] = pm['pktsize'];
                                delete pm['pktsize'];
                            }
                            delete pm['life'];
                            // delete pm['bandwidth'];
                            pm = removeNullPro(pm);
                            input['performance-container'] = {
                                'performance-task': [pm]
                            };
                        }
                        input['loopback-container'] = {
                            "loopback-task": [{
                                // "index": "3",
                                "loopback-ne-id": desNeId,
                                "flag": "rcsam",
                                // "openflowid": "10",
                                "type": "internal",
                                "flow": "l2",
                                "enable": "true"
                            }]
                        };
                        TunnelSvc.createY1564(input, function(result) {
                            if (result === 'success') {
                                alert($filter('translate')('enable y1564 success'));
                                $state.go('main.tunnel.index', null, { reload: true });
                            } else {
                                alert($filter('translate')('enable y1564 failure'));
                            }
                        });
                    }
                };

                /****************y1564 test start******************/

                $scope.toggleY1564 = function() {
                    $scope.y1564 = {};
                    $scope.addY1564TestShow = !$scope.addY1564TestShow;
                    $scope.y1564TestShow = !$scope.y1564TestShow;
                    $scope.y1564BtnShow = $scope.y1564TestShow; //确认 取消按钮 显示 隐藏
                };

                $scope.addY1564CfgTest = function() {
                    //判断是否带qos，如果带qos，则允许进行配置测试，如果不带qos，则不允许进行配置测试，只允许进行性能测试
                    $scope.y1564TestShow = true;
                    $scope.y1564BtnShow = $scope.y1564TestShow; //确认 取消按钮 显示 隐藏
                    $scope.configTestShow = !$scope.configTestShow;
                };


                $scope.addY1564PmTest = function() {
                    $scope.y1564TestShow = true;
                    $scope.y1564BtnShow = $scope.y1564TestShow; //确认 取消按钮 显示 隐藏
                    $scope.pmTestShow = !$scope.pmTestShow;
                };

                $scope.expandConfigTest = function() {
                    if ($scope.y1564 === undefined) {
                        $scope.y1564 = {};
                    }
                    $scope.y1564.cfg = {};
                    $scope.configTestExpand = !$scope.configTestExpand;
                };

                $scope.expandPmTest = function() {
                    if ($scope.y1564 === undefined) {
                        $scope.y1564 = {};
                    }
                    $scope.y1564.pm = {};
                    $scope.pmTestExpand = !$scope.pmTestExpand;
                };

                $scope.createY1564 = function(y1564) {
                    if (y1564) {
                        console.log(y1564);
                        var srcNeId = $scope.eline['ingress-end-points'][0]['ne-id'];
                        var desNeId = $scope.eline['egress-end-points'][0]['ne-id'];

                        var input = {};
                        input['service-id'] = $scope.eline.id;
                        input['auto-start'] = y1564.cfg['start'] && y1564.pm['start'];

                        if ($scope.yconfigTestShow === true && $scope.ypmTestShow === true) {
                            input['type'] = 'both';
                        } else if ($scope.yconfigTestShow === true && $scope.ypmTestShow === false) {
                            input['type'] = 'throughput';
                        } else if ($scope.yconfigTestShow === false && $scope.ypmTestShow === true) {
                            input['type'] = 'performance';
                        }
                        if ($scope.yconfigTestShow === true) {
                            var cfg = y1564.cfg;
                            cfg['type'] = 'throughput';
                            delete cfg['start'];
                            delete cfg['period'];
                            cfg['initial-ne-id'] = srcNeId;
                            cfg['loopback-ne-id'] = desNeId;
                            cfg['frametype'] = 'l2';
                            cfg['bandenable'] = 'false';
                            cfg['task-role'] = 'master';
                            cfg['pktsize'] = String(cfg['pktsize']);
                            if (cfg['pktsizepattern'] === 'random') {
                                delete cfg['pktsize'];
                            }
                            cfg = removeNullPro(cfg);
                            input['throughput-container'] = {
                                'throughput-task': [cfg]
                            };
                        }
                        if ($scope.ypmTestShow === true) {
                            var pm = y1564.pm;
                            pm['type'] = 'performance';
                            delete pm['start'];
                            pm['initial-ne-id'] = srcNeId;
                            pm['loopback-ne-id'] = desNeId;
                            pm['frametype'] = 'l2';
                            pm['bandenable'] = 'false';
                            pm['pktsize'] = String(pm['pktsize']);
                            if (pm['pktsizepattern'] === 'random') {
                                delete pm['pktsize'];
                            }
                            delete pm['life'];
                            delete pm['bandwidth'];
                            pm = removeNullPro(pm);
                            input['performance-container'] = {
                                'performance-task': [pm]
                            };
                        }
                        input['loopback-container'] = {
                            "loopback-task": [{
                                // "index": "3",
                                "loopback-ne-id": desNeId,
                                "flag": "rcsam",
                                // "openflowid": "10",
                                "type": "internal",
                                "flow": "l2",
                                "enable": "true"
                            }]
                        };
                        TunnelSvc.createY1564(input);
                    }
                    $state.go('main.tunnel.index', null, { reload: true });
                };

                /****************y1564 test end******************/

                //muban
                $scope.showModuleDetail = function(index) {
                    if ($scope.elineModel === undefined) {
                        $scope.elineModel = {};
                    }
                    if (index === 1) {
                        $scope.elineModel.elineType = "一源两宿";
                        $scope.elineModel.srcNeId = "openflow:17";
                        $scope.elineModel.desNeId = "openflow:19,openflow:22";
                        $scope.elineModel.srcLtpId = "16";
                        $scope.elineModel.desLtpId = "UNKNOWN";
                        $scope.elineModel.srcVlan = "100";
                        $scope.elineModel.desVlan = "100";
                        $scope.elineModel.protectType = "业务保护";
                        $scope.elineModel.oamType = "BFD";
                    } else if (index === 2) {
                        $scope.elineModel.elineType = "一源一宿";
                        $scope.elineModel.srcNeId = "openflow:17";
                        $scope.elineModel.desNeId = "openflow:19";
                        $scope.elineModel.srcLtpId = "16";
                        $scope.elineModel.desLtpId = "UNKNOWN";
                        $scope.elineModel.srcVlan = "100";
                        $scope.elineModel.desVlan = "100";
                        $scope.elineModel.protectType = "业务保护";
                        $scope.elineModel.oamType = "BFD";
                    }
                };

                $scope.createElineQuik = function() {
                    alert("快速创建功能正在开发中～");
                };


                $scope.createElineDetail = function() {
                    $state.go('main.tunnel.create-eline');
                    // if($scope.elineModel!==undefined && $scope.elineModel.name!==undefined && $scope.eline!==undefined){
                    //     $scope.eline.name = $scope.elineModel.name;
                    // }
                };

                //删除重复链路
                function formatLinks(links) {

                    var linkList = [];

                    if (links) {
                        var flag = true;
                        for (var a = 0; a < links.length; a++) {
                            for (var b = a + 1; b < links.length; b++) {
                                var aa = links[a]['left-ltp-id'] + links[a]['right-ltp-id'];
                                var bb = links[b]['left-ltp-id'] + links[b]['right-ltp-id'];
                                var cc = links[b]['right-ltp-id'] + links[b]['left-ltp-id'];

                                if (aa == bb || aa == cc) {
                                    flag = false;
                                    break;
                                }
                            }

                            if (flag) {
                                linkList.push(links[a]);
                            }

                            flag = true;
                        }
                    }

                    return linkList;

                }

                function getNodeUserLabelById(nodeId) {
                    var nUserLabel;
                    TunnelSvc.getNodeUserLabelById(nodeId, function(data) {
                        nUserLabel = data;
                    });
                    return nUserLabel;
                }

                function getPortUserLabel(nodeId, connId) {
                    var pUserLabel;
                    TunnelSvc.getPortUserLabel(nodeId, connId, function(data) {
                        pUserLabel = data;
                    });
                    return pUserLabel;
                }



                function formatExtLinks(links) {

                    var linkList = [];

                    if (links) {
                        for (var i = 0; i < links.length; i++) {
                            if (links[i].id.indexOf("reverse") === -1) {
                                if (links[i]['left-ltp-user-label'] === "") { //ext node
                                    var loc1 = links[i]['left-ltp-id'].lastIndexOf(":");
                                    var loc21 = links[i]['right-ltp-id'].lastIndexOf(":");
                                    links[i]['left-ltp-user-label'] = links[i]['left-node-user-label'] + ":" + links[i]['left-ltp-id'].substring(loc1 + 1);
                                    links[i]['right-ltp-user-label'] = links[i]['right-node-user-label'] + ":" + links[i]['right-ltp-id'].substring(loc21 + 1);
                                }
                                if (links[i]['right-ltp-user-label'] === "") { //ext node
                                    var loc2 = links[i]['right-ltp-id'].lastIndexOf(":");
                                    var loc22 = links[i]['left-ltp-id'].lastIndexOf(":");
                                    links[i]['left-ltp-user-label'] = links[i]['left-node-user-label'] + ":" + links[i]['left-ltp-id'].substring(loc22 + 1);
                                    links[i]['right-ltp-user-label'] = links[i]['right-node-user-label'] + ":" + links[i]['right-ltp-id'].substring(loc2 + 1);
                                }
                                if (links[i]['left-ltp-user-label'] === "" || links[i]['right-ltp-user-label'] === "") {
                                    links[i]['user-label'] = links[i]['left-ltp-user-label'] + "--" + links[i]['right-ltp-user-label'];
                                }
                                linkList.push(links[i]);
                            }
                        }
                    }

                    return linkList;

                }




                //获取所有外部link
                TunnelSvc.getExtLinks(function(response) {

                    $scope.extLinkList = response;
                    $scope.extLinkList = formatExtLinks($scope.extLinkList);


                });

                //通过接口获取的extNode的数据结构与node的数据结构不同　extNode：node-connects　node：node-connector
                function extNodeProcess(extNodeList) {
                    var extNodes = [];
                    if (extNodeList && extNodeList.length !== 0) {
                        for (var i = 0; i < extNodeList.length; i++) {
                            extNodeList[i]['userlabel'] = extNodeList[i]['user-label'];
                            //孤立外部节点没有node-connects属性
                            if (extNodeList[i].hasOwnProperty('node-connects') === false) {
                                var conn = {};
                                conn['id'] = extNodeList[i].id + ":UNKNOWN";
                                conn['ltp-id'] = conn['id'];
                                conn['sdn-inventory:user-label'] = conn['id'];
                                extNodeList[i]['node-connector'] = [conn];
                            } else {
                                for (var j = 0; j < extNodeList[i]['node-connects'].length; j++) {
                                    var ltpId = extNodeList[i]['node-connects'][j]['ltp-id'];
                                    if (ltpId.lastIndexOf(":") === -1) {
                                        //外部节点ltp-id不带冒号
                                        ltpId = ltpId + ":UNKNOWN";
                                    } else {
                                        //外部节点ltp-id带冒号
                                        ltpId = ltpId.substring(0, ltpId.lastIndexOf(":") + 1) + "UNKNOWN";
                                    }
                                    extNodeList[i]['node-connects'][j]['ltp-id'] = ltpId;
                                    extNodeList[i]['node-connects'][j]['id'] = ltpId;
                                    var loc = extNodeList[i]['node-connects'][j]['user-label'].indexOf(extNodeList[i].id);
                                    if (loc !== -1) {
                                        extNodeList[i]['node-connects'][j]['user-label'] = extNodeList[i]['node-connects'][j]['user-label'].substring(loc + extNodeList[i].id.length + 1);
                                    } else {
                                        extNodeList[i]['node-connects'][j]['user-label'] = "UNKNOWN";
                                    }
                                    extNodeList[i]['node-connects'][j]['sdn-inventory:user-label'] = extNodeList[i]['node-connects'][j]['user-label'];
                                }
                                extNodeList[i]['node-connector'] = extNodeList[i]['node-connects'];

                            }

                        }
                    }
                    extNodes = extNodeList;
                    return extNodes;
                }


                //外部节点不带端口
                var extSwitchs = [];
                var extPorts = [];
                //获取所有外部node
                TunnelSvc.getExtNodes(function(response) {

                    if (!$scope.extLinkList || $scope.extLinkList.length === 0) {
                        alert("没有创建外部链路，请创建外部链路！");
                        return;
                    }

                    $scope.extNodeList = extNodeProcess(response);

                    var tmpPort = {};
                    var tmpPortStrList = [];
                    if ($scope.extNodeList && $scope.extNodeList.length !== 0) {
                        for (var c = 0; c < $scope.extNodeList.length; c++) {
                            // extSwitchs.push({ 'id': response[c].id });
                            extSwitchs.push($scope.extNodeList[c]);
                            //extLink可能是双向的
                            for (var o = 0; o < $scope.extLinkList.length; o++) {
                                tmpPort = {};
                                var tmpLtpArr = $scope.extLinkList[o]['id'].split("--");
                                if (tmpLtpArr[0] && tmpLtpArr[0].indexOf($scope.extNodeList[c].id) !== -1) {

                                    var tmpPortStr;
                                    if (tmpLtpArr[0].lastIndexOf(":") === -1) {
                                        //外部节点不带冒号
                                        tmpPortStr = tmpLtpArr[0] + ":UNKNOWN";
                                    } else {
                                        //外部节点带冒号
                                        tmpPortStr = tmpLtpArr[0].substring(0, tmpLtpArr[0].lastIndexOf(":") + 1) + "UNKNOWN";
                                    }

                                    tmpPort['id'] = tmpPortStr;
                                    tmpPort['userlabel'] = $scope.extNodeList[c]['user-label'];
                                    if (tmpPortStrList.indexOf(tmpPortStr) === -1) {
                                        tmpPortStrList.push(tmpPortStr);
                                        extPorts.push(tmpPort);
                                    }

                                }
                                if (tmpLtpArr[1] && tmpLtpArr[1].indexOf($scope.extNodeList[c].id) !== -1) {

                                    var tmpPortStr2;
                                    if (tmpLtpArr[1].lastIndexOf(":") === -1) {
                                        //外部节点不带冒号
                                        tmpPortStr2 = tmpLtpArr[1] + ":UNKNOWN";
                                    } else {
                                        //外部节点带冒号
                                        tmpPortStr2 = tmpLtpArr[1].substring(0, tmpLtpArr[1].lastIndexOf(":") + 1) + "UNKNOWN";
                                    }

                                    tmpPort['id'] = tmpPortStr2;
                                    tmpPort['userlabel'] = response[c]['user-label'];
                                    if (tmpPortStrList.indexOf(tmpPortStr2) === -1) {
                                        tmpPortStrList.push(tmpPortStr2);
                                        extPorts.push(tmpPort);
                                    }

                                }
                            }
                            // extPorts.push(response[c].id+":1");
                        }
                    }
                });



                var curSwitchs = TunnelSvc.getCurrentSwitchs();
                var node = {};
                var port = {};
                var portStrList = [];
                if (curSwitchs != null) {
                    curSwitchs.then(function(data) {
                        $scope.nodes = data[0].node;
                        $scope.nodes = filterNodes($scope.nodes);
                        for (var i in $scope.nodes) {
                            $scope.nodes[i]['userlabel'] = $scope.nodes[i]['sdn-inventory:user-label'];
                            for (var j in $scope.nodes[i]['node-connector']) {
                                port = {};
                                //$scope.allPorts.push($scope.nodes[i]['node-connector'][j].id);
                                port['id'] = $scope.nodes[i]['node-connector'][j].id;
                                port['userlabel'] = $scope.nodes[i]['node-connector'][j]['sdn-inventory:user-label'];
                                // $scope.allPorts.push(port);

                                //
                                // if (portStrList.indexOf(port['id']) === -1) {
                                //     portStrList.push(port['id']);
                                // }

                                if (portStrList.indexOf(port['id']) === -1) {
                                    portStrList.push(port['id']);
                                    $scope.allPorts.push(port);
                                }
                                //
                            }
                        }
                        //将外部节点列表添加到allPorts内
                        $scope.allPorts = $scope.allPorts.concat(extPorts);
                        $scope.nodes = $scope.nodes.concat(extSwitchs);
                    });
                } else {
                    TunnelSvc.getSwitchs().then(function(data) {
                        $scope.nodes = data[0].node;
                        $scope.nodes = filterNodes($scope.nodes);

                        for (var i in $scope.nodes) {
                            $scope.nodes[i]['userlabel'] = $scope.nodes[i]['sdn-inventory:user-label'];
                            for (var j in $scope.nodes[i]['node-connector']) {
                                port = {};
                                // $scope.allPorts.push($scope.nodes[i]['node-connector'][j].id);
                                port['id'] = $scope.nodes[i]['node-connector'][j].id;
                                port['userlabel'] = $scope.nodes[i]['node-connector'][j]['sdn-inventory:user-label'];
                                // $scope.allPorts.push(port);
                                //
                                // if (portStrList.indexOf(port['id']) === -1) {
                                //     portStrList.push(port['id']);
                                // }

                                if (portStrList.indexOf(port['id']) === -1) {
                                    portStrList.push(port['id']);
                                    $scope.allPorts.push(port);
                                }
                                //
                            }
                        }
                        //将外部节点列表添加到allPorts内
                        $scope.allPorts = $scope.allPorts.concat(extPorts);
                        $scope.nodes = $scope.nodes.concat(extSwitchs);
                    });
                }


                function filterNodes(nodes) {
                    var fNodes = [];
                    if (nodes && nodes.length !== 0) {

                        for (var i = 0; i < nodes.length; i++) {
                            var node = nodes[i];
                            if (node.id.indexOf('openflow') !== -1) {
                                fNodes.push(node);
                            }
                        }
                    }
                    return fNodes;
                }

                $scope.getPortList = function(index, node, inOrE) {

                    $scope.portList = node['node-connector'];
                    if (node['node-connects'] === undefined) { //内部节点
                        var filterPortList = [];
                        if ($scope.portList) {
                            for (var i = 0; i < $scope.portList.length; i++) {
                                $scope.portList[i]['userlabel'] = $scope.portList[i]['sdn-inventory:user-label'];
                                var portNumber = Number($scope.portList[i]['flow-node-inventory:port-number']);
                                if (portNumber < 4026531841) { //过滤掉逻辑端口
                                    filterPortList.push($scope.portList[i]);
                                }
                            }
                        }
                        $scope.portList = filterPortList;
                    } else { //外部节点
                        if ($scope.portList) {
                            for (var j = 0; j < $scope.portList.length; j++) {
                                $scope.portList[j]['userlabel'] = $scope.portList[j]['sdn-inventory:user-label'];
                            }
                        }

                    }

                    if (inOrE === 1) {
                        $scope.eline['ingress-end-points'][index]['port_userlabel'] = undefined;
                        if ($scope.eline['ingress-end-points'] !== undefined && $scope.eline['ingress-end-points'][index] !== undefined) {
                            $scope.eline['ingress-end-points'][index]['node_userlabel'] = node['userlabel'];
                        }
                    } else if (inOrE === 2) {
                        $scope.eline['egress-end-points'][index]['port_userlabel'] = undefined;
                        if ($scope.eline['egress-end-points'] !== undefined && $scope.eline['egress-end-points'][index] !== undefined) {
                            $scope.eline['egress-end-points'][index]['node_userlabel'] = node['userlabel'];
                        }
                    }

                };



                var tunnels = TunnelSvc.getCurrentTunnels();
                if (tunnels != null) {
                    tunnels.then(function(data) {
                        var tunnels = data[0].tunnel;
                        for (var i in tunnels) {
                            $scope.tunnelIds.push(tunnels[i].id);
                        }
                    });
                } else {
                    TunnelSvc.getTunnels().then(function(data) {
                        var tunnels = data[0].tunnel;
                        for (var i in tunnels) {
                            $scope.tunnelIds.push(tunnels[i].id);
                        }
                    });
                }

                //Dot1q Edit
                $scope.dot1qModify = true;
                $scope.dot1qModify2 = true;
                $scope.editDot1q = function(index) {
                    if (index === 1) {
                        if ($scope.dot1qModify === true) {
                            $scope.dot1qModify = false;
                        } else {
                            $scope.dot1qModify = true;
                        }
                    } else if (index === 2) {
                        if ($scope.dot1qModify2 === true) {
                            $scope.dot1qModify2 = false;
                        } else {
                            $scope.dot1qModify2 = true;
                        }
                    }

                };

                //UUID生成
                function createUUID() {
                    var s = [];
                    var hexDigits = "0123456789abcdef";
                    for (var i = 0; i < 36; i++) {
                        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
                    }
                    s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
                    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
                    s[8] = s[13] = s[18] = s[23] = "-";

                    var uuid = s.join("");
                    return uuid;
                }

                $scope.eqos = {};

                //监听eline内相关参数变化
                $scope.$watch('eline', function() {
                    //qos
                    if ($scope.eline.pw !== undefined && $scope.eline.pw.length > 0) {
                        for (var q = 0; q < $scope.eline.pw.length; q++) {
                            if ($scope.eline.pw[q].qos !== undefined) {

                                if ($scope.eline.pw[q].qos['qos-a2z-cir']) {
                                    if (!$scope.eqos[q + '-qos-a2z-cir'] || $scope.eline.pw[q].qos['qos-a2z-cir'] !== $scope.eqos[q + '-qos-a2z-cir']) {
                                        $scope.eline.pw[q].qos['qos-a2z-cbs'] = $scope.eline.pw[q].qos['qos-a2z-cir'] / 8;
                                    }
                                    $scope.eqos[q + '-qos-a2z-cir'] = $scope.eline.pw[q].qos['qos-a2z-cir'];
                                } else {
                                    $scope.eline.pw[q].qos['qos-a2z-cir'] = null;
                                    delete $scope.eline.pw[q].qos['qos-a2z-cir'];
                                    $scope.eline.pw[q].qos['qos-a2z-cbs'] = null;
                                    delete $scope.eline.pw[q].qos['qos-a2z-cbs'];
                                }

                                if ($scope.eline.pw[q].qos['qos-a2z-pir']) {

                                    if (!$scope.eqos[q + '-qos-a2z-pir'] || $scope.eline.pw[q].qos['qos-a2z-pir'] !== $scope.eqos[q + '-qos-a2z-pir']) {
                                        $scope.eline.pw[q].qos['qos-a2z-pbs'] = $scope.eline.pw[q].qos['qos-a2z-pir'] / 8;
                                    }
                                    $scope.eqos[q + '-qos-a2z-pir'] = $scope.eline.pw[q].qos['qos-a2z-pir'];
                                } else {
                                    $scope.eline.pw[q].qos['qos-a2z-pir'] = null;
                                    delete $scope.eline.pw[q].qos['qos-a2z-pir'];
                                    $scope.eline.pw[q].qos['qos-a2z-pbs'] = null;
                                    delete $scope.eline.pw[q].qos['qos-a2z-pbs'];
                                }

                                if ($scope.eline.pw[q].qos['qos-z2a-cir']) {
                                    if (!$scope.eqos[q + '-qos-z2a-cir'] || $scope.eline.pw[q].qos['qos-z2a-cir'] !== $scope.eqos[q + '-qos-z2a-cir']) {
                                        $scope.eline.pw[q].qos['qos-z2a-cbs'] = $scope.eline.pw[q].qos['qos-z2a-cir'] / 8;
                                    }
                                    $scope.eqos[q + '-qos-z2a-cir'] = $scope.eline.pw[q].qos['qos-z2a-cir'];
                                } else {
                                    $scope.eline.pw[q].qos['qos-z2a-cir'] = null;
                                    delete $scope.eline.pw[q].qos['qos-z2a-cir'];
                                    $scope.eline.pw[q].qos['qos-z2a-cbs'] = null;
                                    delete $scope.eline.pw[q].qos['qos-z2a-cbs'];
                                }

                                if ($scope.eline.pw[q].qos['qos-z2a-pir']) {
                                    if (!$scope.eqos[q + '-qos-z2a-pir'] || $scope.eline.pw[q].qos['qos-z2a-pir'] !== $scope.eqos[q + '-qos-z2a-pir']) {
                                        $scope.eline.pw[q].qos['qos-z2a-pbs'] = $scope.eline.pw[q].qos['qos-z2a-pir'] / 8;
                                    }
                                    $scope.eqos[q + '-qos-z2a-pir'] = $scope.eline.pw[q].qos['qos-z2a-pir'];
                                } else {
                                    $scope.eline.pw[q].qos['qos-z2a-pir'] = null;
                                    delete $scope.eline.pw[q].qos['qos-z2a-pir'];
                                    $scope.eline.pw[q].qos['qos-z2a-pbs'] = null;
                                    delete $scope.eline.pw[q].qos['qos-z2a-pbs'];
                                }
                            }
                        }
                    }
                    if ($scope.eline['ingress-end-points'] !== undefined && $scope.eline['ingress-end-points'].length > 0) {
                        for (var i = 0; i < $scope.eline['ingress-end-points'].length; i++) {
                            if ($scope.eline['ingress-end-points'][i]['access-action'] === 'Keep') {
                                $scope.eline['ingress-end-points'][i]['action-vlan-id'] = null;
                                delete $scope.eline['ingress-end-points'][i]['action-vlan-id'];
                            }
                            if ($scope.eline['ingress-end-points'][i]['access-action'] === null || $scope.eline['ingress-end-points'][i]['access-action'] === "") {
                                $scope.eline['ingress-end-points'][i]['action-vlan-id'] = null;
                                delete $scope.eline['ingress-end-points'][i]['action-vlan-id'];
                            }
                        }
                    }
                    if ($scope.eline['egress-end-points'] !== undefined && $scope.eline['egress-end-points'].length > 0) {
                        for (var j = 0; j < $scope.eline['egress-end-points'].length; j++) {
                            if ($scope.eline['egress-end-points'][j]['access-action'] === 'Keep') {
                                $scope.eline['egress-end-points'][j]['action-vlan-id'] = null;
                                delete $scope.eline['egress-end-points'][j]['action-vlan-id'];
                            }
                            if ($scope.eline['egress-end-points'][j]['access-action'] === null || $scope.eline['egress-end-points'][j]['access-action'] === "") {
                                $scope.eline['egress-end-points'][j]['action-vlan-id'] = null;
                                delete $scope.eline['egress-end-points'][j]['action-vlan-id'];
                            }
                        }
                    }
                }, true);

                $scope.selLtpId = function(index, port, inOrE) {
                    if (inOrE === 1) {
                        if ($scope.eline['ingress-end-points'] !== undefined && $scope.eline['ingress-end-points'][index] !== undefined) {
                            $scope.eline['ingress-end-points'][index]['ltp-id'] = port.id;
                            $scope.eline['ingress-end-points'][index]['port_userlabel'] = port['userlabel'];
                        }
                    } else if (inOrE === 2) {
                        if ($scope.eline['egress-end-points'] !== undefined && $scope.eline['egress-end-points'][index] !== undefined) {
                            $scope.eline['egress-end-points'][index]['ltp-id'] = port.id;
                            $scope.eline['egress-end-points'][index]['port_userlabel'] = port['userlabel'];
                        }
                    }
                };

                function removeUserLabel(eline) {

                    if (eline['ingress-end-points']) {
                        for (var i = 0; i < eline['ingress-end-points'].length; i++) {
                            if (eline['ingress-end-points'][i].hasOwnProperty('node_userlabel') === true) {
                                delete eline['ingress-end-points'][i]['node_userlabel'];
                            }
                            if (eline['ingress-end-points'][i].hasOwnProperty('port_userlabel') === true) {
                                delete eline['ingress-end-points'][i]['port_userlabel'];
                            }
                        }
                    }
                    if (eline['egress-end-points']) {
                        for (var j = 0; j < eline['egress-end-points'].length; j++) {
                            if (eline['egress-end-points'][j].hasOwnProperty('node_userlabel') === true) {
                                delete eline['egress-end-points'][j]['node_userlabel'];
                            }
                            if (eline['egress-end-points'][j].hasOwnProperty('port_userlabel') === true) {
                                delete eline['egress-end-points'][j]['port_userlabel'];
                            }
                        }
                    }

                }

                $scope.createEline = function(eline) {
                    //eline.id UUID

                    eline['id'] = createUUID();
                    eline['admin-status'] = "admin-up";
                    eline['operate-status'] = "operate-up";
                    eline['parent-ncd-id'] = "parent-ncd-id"; //?
                    eline['snc-type'] = "simple";
                    eline['user-label'] = eline.name;

                    //dot1q vlan
                    for (var dot = 0; dot < eline['ingress-end-points'].length; dot++) {
                        if (eline['ingress-end-points'][dot]['dot1q-vlan-bitmap'] !== undefined && eline['ingress-end-points'][dot]['dot1q-vlan-bitmap'].indexOf("-") !== -1) {
                            var vlans;
                            if (eline['ingress-end-points'][dot]['dot1q-vlan-bitmap'].indexOf(",") !== -1) {
                                var range = eline['ingress-end-points'][dot]['dot1q-vlan-bitmap'].split(",");
                                for (var lis = 0; lis < range.length; lis++) {
                                    if (range[lis].indexOf("-") !== -1) {
                                        var numCounts = range[lis].split("-");
                                        for (var counts = Number(numCounts[0]); counts <= Number(numCounts[1]); counts++) {
                                            if (vlans === undefined) {
                                                vlans = counts;
                                            } else {
                                                vlans = vlans + "," + counts;
                                            }
                                        }
                                    } else {
                                        if (vlans === undefined) {
                                            vlans = range[lis];
                                        } else {
                                            vlans = vlans + "," + range[lis];
                                        }
                                    }
                                }
                            } else {
                                var numCountsTmp = eline['ingress-end-points'][dot]['dot1q-vlan-bitmap'].split("-");
                                for (var countsTmp = Number(numCountsTmp[0]); countsTmp <= Number(numCountsTmp[1]); countsTmp++) {
                                    if (vlans === undefined) {
                                        vlans = countsTmp;
                                    } else {
                                        vlans = vlans + "," + countsTmp;
                                    }
                                }
                            }
                            eline['ingress-end-points'][dot]['dot1q-vlan-bitmap'] = vlans;
                        }
                    }

                    for (var dot2 = 0; dot2 < eline['egress-end-points'].length; dot2++) {
                        if (eline['egress-end-points'][dot2]['dot1q-vlan-bitmap'] !== undefined && eline['egress-end-points'][dot2]['dot1q-vlan-bitmap'].indexOf("-") !== -1) {
                            var vlans2;
                            if (eline['egress-end-points'][dot2]['dot1q-vlan-bitmap'].indexOf(",") !== -1) {
                                var range2 = eline['egress-end-points'][dot2]['dot1q-vlan-bitmap'].split(",");
                                for (var lis2 = 0; lis2 < range2.length; lis2++) {
                                    if (range2[lis2].indexOf("-") !== -1) {
                                        var numCounts2 = range2[lis2].split("-");
                                        for (var counts2 = Number(numCounts2[0]); counts2 <= Number(numCounts2[1]); counts2++) {
                                            if (vlans2 === undefined) {
                                                vlans2 = counts2;
                                            } else {
                                                vlans2 = vlans2 + "," + counts2;
                                            }
                                        }
                                    } else {
                                        if (vlans2 === undefined) {
                                            vlans2 = range2[lis2];
                                        } else {
                                            vlans2 = vlans2 + "," + range2[lis2];
                                        }
                                    }
                                }
                            } else {
                                var numCountsTmp2 = eline['egress-end-points'][dot2]['dot1q-vlan-bitmap'].split("-");
                                for (var countsTmp2 = Number(numCountsTmp2[0]); countsTmp2 <= Number(numCountsTmp2[1]); countsTmp2++) {
                                    if (vlans2 === undefined) {
                                        vlans2 = countsTmp2;
                                    } else {
                                        vlans2 = vlans2 + "," + countsTmp2;
                                    }
                                }
                            }
                            eline['egress-end-points'][dot2]['dot1q-vlan-bitmap'] = vlans2;
                        }
                    }

                    // ingress-id/egress-id  key
                    if (eline['ingress-end-points'].length !== 0 && eline['egress-end-points'].length !== 0) {
                        for (var l = 0; l < eline['ingress-end-points'].length; l++) {
                            eline['ingress-end-points'][l].id = String(l + 1);
                            if (eline['ingress-end-points'][l]['ltp-id'].lastIndexOf(":") !== -1) {
                                eline['ingress-end-points'][l]['ne-id'] = eline['ingress-end-points'][l]['ltp-id'].substring(0, eline['ingress-end-points'][l]['ltp-id'].lastIndexOf(":"));
                                eline['ingress-end-points'][l]['ltp-id'] = eline['ingress-end-points'][l]['ltp-id'].substring(eline['ingress-end-points'][l]['ltp-id'].lastIndexOf(":") + 1);
                            }
                        }
                        for (var j = 0; j < eline['egress-end-points'].length; j++) {
                            eline['egress-end-points'][j].id = String(j + 1);
                            if (eline['egress-end-points'][j]['ltp-id'].lastIndexOf(":") !== -1) {
                                eline['egress-end-points'][j]['ne-id'] = eline['egress-end-points'][j]['ltp-id'].substring(0, eline['egress-end-points'][j]['ltp-id'].lastIndexOf(":"));
                                if (eline['egress-end-points'][j]['ltp-id'].substring(eline['egress-end-points'][j]['ltp-id'].lastIndexOf(":") + 1) === "UNKNOWN") {
                                    eline['egress-end-points'][j]['ltp-id'] = 1;
                                } else {
                                    eline['egress-end-points'][j]['ltp-id'] = eline['egress-end-points'][j]['ltp-id'].substring(eline['egress-end-points'][j]['ltp-id'].lastIndexOf(":") + 1);
                                }
                            }

                        }
                    }

                    if (eline.protection != null) {
                        eline['protection']['snc-id'] = "1";
                        eline['protection']['name'] = eline.name + "-pro1";
                        eline['protection']['layer-rate'] = "pw";
                        //           eline['protection']['reroute-revertive-mode'] = "rvt";
                    }
                    var autoCreFlag = false;

                    if ($scope.curPwType === "自动创建") {
                        autoCreFlag = true;

                        //自动创建 通过eline的ingress/egress构建pw、xc
                        var pwData = {
                            'encaplate-type': "cep-mpls",
                            'ctrl-word-support': "nonsupport",
                            'sn-support': "nonsupport",
                            'vccv-type': "nonsupport",
                            'conn-ack-type': "none",
                            'admin-status': "admin-up",
                            'operate-status': "operate-up",
                            //        'route':[{'id':'1','snc-id':'11','xc':[]}]
                        };
                        //Qos的参数
                        var qosData = [];
                        if ($scope.eline.pw.length !== undefined && $scope.eline.pw.length > 0) {
                            for (var ii = 0; ii < $scope.eline.pw.length; ii++) {
                                if ($scope.eline.pw[ii].qos !== undefined) {
                                    switch (ii) {
                                        case 0:
                                            qosData.push($scope.eline.pw[ii].qos);
                                            break;
                                        case 1:
                                            if (eline['ingress-end-points'].length === 2) {
                                                if ($scope.eline.pw[0].qos['qos-z2a-cbs'] !== undefined) {
                                                    $scope.eline.pw[ii].qos['qos-z2a-cbs'] = $scope.eline.pw[0].qos['qos-z2a-cbs'];
                                                }
                                                if ($scope.eline.pw[0].qos['qos-z2a-cir'] !== undefined) {
                                                    $scope.eline.pw[ii].qos['qos-z2a-cir'] = $scope.eline.pw[0].qos['qos-z2a-cir'];
                                                }
                                                if ($scope.eline.pw[0].qos['qos-z2a-pbs'] !== undefined) {
                                                    $scope.eline.pw[ii].qos['qos-z2a-pbs'] = $scope.eline.pw[0].qos['qos-z2a-pbs'];
                                                }
                                                if ($scope.eline.pw[0].qos['qos-z2a-pir'] !== undefined) {
                                                    $scope.eline.pw[ii].qos['qos-z2a-pir'] = $scope.eline.pw[0].qos['qos-z2a-pir'];
                                                }
                                            } else if (eline['egress-end-points'].length === 2) {
                                                if ($scope.eline.pw[0].qos['qos-a2z-cbs'] !== undefined) {
                                                    $scope.eline.pw[ii].qos['qos-a2z-cbs'] = $scope.eline.pw[0].qos['qos-a2z-cbs'];
                                                }
                                                if ($scope.eline.pw[0].qos['qos-a2z-cir'] !== undefined) {
                                                    $scope.eline.pw[ii].qos['qos-a2z-cir'] = $scope.eline.pw[0].qos['qos-a2z-cir'];
                                                }
                                                if ($scope.eline.pw[0].qos['qos-a2z-pbs'] !== undefined) {
                                                    $scope.eline.pw[ii].qos['qos-a2z-pbs'] = $scope.eline.pw[0].qos['qos-a2z-pbs'];
                                                }
                                                if ($scope.eline.pw[0].qos['qos-a2z-pir'] !== undefined) {
                                                    $scope.eline.pw[ii].qos['qos-a2z-pir'] = $scope.eline.pw[0].qos['qos-a2z-pir'];
                                                }
                                            }
                                            qosData.push($scope.eline.pw[ii].qos);
                                            break;
                                    }
                                }
                            }
                        }
                        eline.pw = [];




                        var srcOrDesLen = 0;

                        //带保护的pw
                        switch ($scope.curAutoType) {
                            case "pw冗余":
                                eline.protection = {};
                                eline['protection']['layer-rate'] = "pw";
                                eline['protection']['linear-protection-protocol'] = "NONE";
                                eline['protection']['wtr'] = "0";
                                eline['protection']['name'] = eline.name + "-pro1";
                                break;
                            case "pw 1:1 APS协议 保护":
                                eline.protection = {};
                                eline['protection']['layer-rate'] = "pw";
                                eline['protection']['snc-id'] = "1";
                                eline['protection']['linear-protection-type'] = 'path-protection-1-to-1';
                                eline['protection']['linear-protection-protocol'] = "APS";
                                //            eline['protection']['reroute-revertive-mode'] = "rvt";
                                break;
                            case "pw 1:1 PSC协议 保护":
                                eline.protection = {};
                                eline['protection']['layer-rate'] = "pw";
                                eline['protection']['snc-id'] = "1";
                                eline['protection']['linear-protection-type'] = 'path-protection-1-to-1';
                                eline['protection']['linear-protection-protocol'] = "PSC";
                                eline['protection']['reroute-revertive-mode'] = "rvt";
                                break;
                            case "无保护":
                                break;
                                /* case "pw permanent-1-to-1 APS protection":永久保护
                                  eline['protection']['snc-id'] = "1";
                                  eline['protection']['linear-protection-type'] = 'permanent-1-to-1-protection';
                                  break; */
                        }
                        //proctection end

                        //这里的判断在界面要加add ingress/egress按钮的隐藏/显示
                        if ((eline['ingress-end-points'].length == 2 && eline['egress-end-points'].length == 1) || (eline['ingress-end-points'].length == 1 && eline['egress-end-points'].length == 2)) {
                            srcOrDesLen = 2;
                        } else if (eline['ingress-end-points'].length == 1 && eline['egress-end-points'].length == 1) {
                            if ($scope.curAutoType === "pw 1:1 APS协议 保护" || $scope.curAutoType === "pw 1:1 PSC协议 保护") {
                                srcOrDesLen = 2;
                            } else {
                                srcOrDesLen = 1;
                            }
                        } else if (eline['ingress-end-points'].length > 2 && eline['egress-end-points'].length > 2) {
                            alert("Ingress/Egress numbers out of beyond!");
                        }

                        for (var i = 0; i < srcOrDesLen; i++) {
                            pwData.id = createUUID();
                            pwData.name = eline.name + "-pw-" + (i + 1);
                            pwData.index = String(i + 1);
                            //组织pw和xc
                            if (eline['ingress-end-points'].length == 2) {
                                pwData['ingress-ne-id'] = eline['ingress-end-points'][i]['ne-id'];
                                pwData['ingress-ne-id'] = eline['egress-end-points'][0]['ne-id'];
                            } else if (eline['egress-end-points'].length == 2) {
                                pwData['ingress-ne-id'] = eline['ingress-end-points'][0]['ne-id'];
                                pwData['egress-ne-id'] = eline['egress-end-points'][i]['ne-id'];

                            } else if (eline['ingress-end-points'].length == 1) {
                                pwData['ingress-ne-id'] = eline['ingress-end-points'][0]['ne-id'];
                                pwData['egress-ne-id'] = eline['egress-end-points'][0]['ne-id'];
                                pwData.qos = qosData[i];

                            }
                            //Qos
                            if (qosData[i] !== undefined) {
                                pwData.qos = qosData[i];
                            }

                            var tmpNum = Math.round(Math.random() * 10000) + 1;
                            if (i === 0) { //master
                                pwData.role = "master";
                            } else { //slave
                                pwData.role = "slave";
                            }

                            //******************************自动创建OAM start**********************************//
                            if ($scope.curAutoOamType !== undefined || $scope.curAutoOamType !== "") {
                                switch ($scope.curAutoOamType) {
                                    case "cc":
                                        pwData.oam = {
                                            'belonged-id': i + 1,
                                            'name': i,
                                            'layer-rate': 'pw',
                                            'cc-exp': $scope.autoOamData['cc-exp'],
                                            'meg-id': tmpNum,
                                            'meps': [{
                                                'id': 1,
                                                'name': 1
                                            }, {
                                                'id': 2,
                                                'name': 2
                                            }],
                                            'cc-interval': $scope.autoOamData['cc-interval'],
                                            'lm-mode': $scope.autoOamData['lm-mode'],
                                            'dm-mode': $scope.autoOamData['dm-mode']
                                        };
                                        break;
                                    case "bfd":
                                        pwData.oam = {
                                            'localdetectmultiplier': $scope.autoOamData['localdetectmultiplier'],
                                            'ttl': 255,
                                            'localtxinterval': $scope.autoOamData['localtxinterval']
                                        };
                                        break;
                                }
                            }
                            //******************************自动创建OAM end**********************************//

                            //******************************pw-xc及路径策略构造 start**********************************//
                            //初始化路径策略构造
                            if (($scope.extMasterXcList.length !== undefined || $scope.extSlaveXcList.length !== undefined) && ($scope.extMasterXcList.length !== 0 || $scope.extSlaveXcList.length !== 0)) {
                                eline['calculate-constraint'] = {};
                                if ($scope.extMasterXcList.length !== undefined) {
                                    var tmpWorkCalculate = {
                                        //                  'explicit-include-link':{
                                        //                    'explicit-include-link-list':[]
                                        //                  },
                                        'explicit-include-ne': {
                                            'explicit-include-ne-list': []
                                        }
                                    };
                                    eline['calculate-constraint']['work-calculate-constraint'] = tmpWorkCalculate;
                                }
                                if ($scope.extSlaveXcList.length !== undefined) {
                                    var tmpSlaveCalculate = {
                                        //                  'explicit-include-link':{
                                        //                    'explicit-include-link-list':[]
                                        //                  },
                                        'explicit-include-ne': {
                                            'explicit-include-ne-list': []
                                        }
                                    };
                                    eline['calculate-constraint']['protect-calculate-constraint'] = tmpSlaveCalculate;
                                }
                            } else {
                                //添加纯sdn域内设备的pw
                                var purPwData = {};
                                $.extend(true, purPwData, pwData);
                                eline.pw.push(purPwData);
                            }

                            //循环遍历每个外部节点，若带pw-label的xc与ingress/egress匹配，则构造xc，同时构造路径策略
                            //Master Ext Node
                            if ($scope.extMasterXcList.length !== undefined) {
                                for (var e = 0; e < $scope.extMasterXcList.length; e++) {
                                    //*******xc构造 start*******//
                                    if ($scope.extMasterXcList[e]['des-pw-label'] !== undefined && $scope.extMasterXcList[e]['des-pw-label'] !== "") {
                                        //与ingress对应的肯定是右侧ext link的des-pw-label

                                        //若ne-id相等，构造xc                 
                                        //                                         if ($scope.extMasterXcList[e]['ne-id'] === pwData['ingress-ne-id']) {
                                        var pwData1 = {};
                                        $.extend(true, pwData1, pwData);
                                        pwData1['route'] = [];
                                        var extXC1 = {
                                            'ne-id': pwData1['ingress-ne-id'],
                                            //xc下4个label构造的是指定的pw标签
                                            'forward-out-label': $scope.extMasterXcList[e]['des-pw-label'],
                                            'backward-in-label': $scope.extMasterXcList[e]['des-pw-label'],
                                            //                          'egress-vlan':$scope.extMasterXcList[e]['egress-vlan']
                                        };
                                        //!!!!重要 构造另一侧的sdn设备的xc
                                        var XC2 = {
                                            'ne-id': pwData1['ingress-ne-id'],
                                            //xc下4个label构造的是指定的pw标签
                                            'forward-in-label': $scope.extMasterXcList[e]['des-pw-label'],
                                            'backward-out-label': $scope.extMasterXcList[e]['des-pw-label'],
                                            //                          'egress-vlan':$scope.extMasterXcList[e]['egress-vlan']
                                        };

                                        pwData1['route'].push({ 'id': '1', 'snc-id': '11', 'xc': [extXC1, XC2] });

                                        console.log(pwData1);
                                        eline.pw.push(pwData1);
                                        //                                         }

                                    }
                                    if ($scope.extMasterXcList[e]['src-pw-label'] !== undefined && $scope.extMasterXcList[e]['src-pw-label'] !== "") {
                                        //与egress对应的肯定是左侧ext link的src-pw-label

                                        //若ne-id相等，构造xc                     
                                        //                                         if ($scope.extMasterXcList[e]['ne-id'] === pwData['egress-ne-id']) {
                                        var pw_Data1 = {};
                                        $.extend(true, pw_Data1, pwData);
                                        pw_Data1['route'] = [];
                                        //!!!!重要 构造另一侧的sdn设备的xc
                                        var XC1 = {
                                            'ne-id': pw_Data1['ingress-ne-id'],
                                            //xc下4个label构造的是指定的pw标签
                                            'forward-out-label': $scope.extMasterXcList[e]['src-pw-label'],
                                            'backward-in-label': $scope.extMasterXcList[e]['src-pw-label']

                                            //                          'ingress-vlan':$scope.extMasterXcList[e]['ingress-vlan']
                                        };
                                        var extXC2 = {
                                            'ne-id': pw_Data1['egress-ne-id'],
                                            //xc下4个label构造的是指定的pw标签
                                            'forward-in-label': $scope.extMasterXcList[e]['src-pw-label'],
                                            'backward-out-label': $scope.extMasterXcList[e]['src-pw-label']
                                                //                          'ingress-vlan':$scope.extMasterXcList[e]['ingress-vlan']
                                        };

                                        pw_Data1['route'].push({ 'id': '1', 'snc-id': '11', 'xc': [XC1, extXC2] });


                                        //                        pwData['route'][i]['xc'][0] = 
                                        //                        console.log("宿端点为外部节点的xc构造完成");
                                        console.log(pw_Data1);
                                        eline.pw.push(pw_Data1);
                                        //                                         }

                                    }
                                    //*******xc构造 start*******//

                                    //*******路径策略构造 start*******//
                                    if ($scope.extMasterXcList[e]['ne-id'] !== undefined && $scope.extMasterXcList[e]['ne-id'] !== "") {
                                        var workCalculateXC = {
                                            "ne-id": $scope.extMasterXcList[e]['ne-id']
                                        };
                                        if (($scope.extMasterXcList[e]['srcLinkId'] !== undefined && $scope.extMasterXcList[e]['srcLinkId'] !== "") || ($scope.extMasterXcList[e]['desLinkId'] !== undefined && $scope.extMasterXcList[e]['desLinkId'] !== "")) {

                                        }
                                        if ($scope.extMasterXcList[e]['srcLinkId'] !== undefined && $scope.extMasterXcList[e]['srcLinkId'] !== "") {
                                            //link                    
                                            //                      eline['calculate-constraint']['work-calculate-constraint']['explicit-include-link']['explicit-include-link-list'].push({'link-id':$scope.extMasterXcList[e]['srcLinkId']});
                                            //ne
                                            workCalculateXC['forward-in-label'] = $scope.extMasterXcList[e]['forward-in-label'];
                                            workCalculateXC['backward-out-label'] = $scope.extMasterXcList[e]['backward-out-label'];
                                            workCalculateXC['ingress-vlan'] = $scope.extMasterXcList[e]['ingress-vlan'];
                                        }
                                        if ($scope.extMasterXcList[e]['desLinkId'] !== undefined && $scope.extMasterXcList[e]['desLinkId'] !== "") {
                                            //link
                                            //                      eline['calculate-constraint']['work-calculate-constraint']['explicit-include-link']['explicit-include-link-list'].push({'link-id':$scope.extMasterXcList[e]['desLinkId']});
                                            //ne
                                            workCalculateXC['forward-out-label'] = $scope.extMasterXcList[e]['forward-out-label'];
                                            workCalculateXC['backward-in-label'] = $scope.extMasterXcList[e]['backward-in-label'];
                                            workCalculateXC['egress-vlan'] = $scope.extMasterXcList[e]['egress-vlan'];
                                        }

                                        eline['calculate-constraint']['work-calculate-constraint']['explicit-include-ne']['explicit-include-ne-list'].push(workCalculateXC);
                                    }
                                    //*******路径策略构造 end*******//
                                }
                            }
                            //Slave Ext Node
                            if ($scope.extSlaveXcList.length !== undefined) {
                                for (var f = 0; f < $scope.extSlaveXcList.length; f++) {
                                    //*******xc构造 start*******//
                                    if ($scope.extSlaveXcList[f]['des-pw-label'] !== undefined && $scope.extSlaveXcList[f]['des-pw-label'] !== "") {
                                        //与ingress对应的肯定是右侧ext link的des-pw-label

                                        //若ne-id相等，构造xc                 
                                        if ($scope.extSlaveXcList[f]['ne-id'] === pwData['ingress-ne-id']) {
                                            var pwData2 = {};
                                            $.extend(true, pwData2, pwData);
                                            pwData2['route'] = [];
                                            var extxc1 = {
                                                'ne-id': pwData2['ingress-ne-id'],
                                                //xc下4个label构造的是指定的pw标签
                                                'forward-out-label': $scope.extSlaveXcList[f]['des-pw-label'],
                                                'backward-in-label': $scope.extSlaveXcList[f]['des-pw-label']
                                                    //                          'egress-vlan':$scope.extSlaveXcList[f]['egress-vlan']
                                            };
                                            var xc2 = {
                                                'ne-id': pwData2['egress-ne-id'],
                                                //xc下4个label构造的是指定的pw标签
                                                'forward-in-label': $scope.extSlaveXcList[f]['des-pw-label'],
                                                'backward-out-label': $scope.extSlaveXcList[f]['des-pw-label']
                                                    //                          'egress-vlan':$scope.extSlaveXcList[f]['egress-vlan']
                                            };


                                            pwData2['route'].push({ 'id': '1', 'snc-id': '11', 'xc': [extxc1, xc2] });



                                            //                        console.log("源端点为外部节点的xc构造完成");
                                            var tmpSlavePwData = pwData2;
                                            console.log(pwData2);
                                            eline.pw.push(tmpSlavePwData);
                                        }

                                    }
                                    if ($scope.extSlaveXcList[f]['src-pw-label'] !== undefined && $scope.extSlaveXcList[f]['src-pw-label'] !== "") {
                                        //与egress对应的肯定是左侧ext link的src-pw-label

                                        //若ne-id相等，构造xc                     
                                        if ($scope.extSlaveXcList[f]['ne-id'] === pwData['egress-ne-id']) {
                                            var pw_Data2 = {};
                                            $.extend(true, pw_Data2, pwData);
                                            pw_Data2['route'] = [];
                                            var xc1 = {
                                                'ne-id': pw_Data2['ingress-ne-id'],
                                                //xc下4个label构造的是指定的pw标签
                                                'forward-out-label': $scope.extSlaveXcList[f]['src-pw-label'],
                                                'backward-in-label': $scope.extSlaveXcList[f]['src-pw-label']
                                                    //                          'ingress-vlan':$scope.extSlaveXcList[f]['ingress-vlan']
                                            };
                                            var extxc2 = {
                                                'ne-id': pw_Data2['egress-ne-id'],
                                                //xc下4个label构造的是指定的pw标签
                                                'forward-in-label': $scope.extSlaveXcList[f]['src-pw-label'],
                                                'backward-out-label': $scope.extSlaveXcList[f]['src-pw-label']
                                                    //                          'ingress-vlan':$scope.extSlaveXcList[f]['ingress-vlan']
                                            };
                                            var rountid2 = 0;

                                            pw_Data2['route'].push({ 'id': '1', 'snc-id': '11', 'xc': [xc1, extxc2] });


                                            //                        pwData['route'][0]['xc'][i] = 
                                            //                        console.log("宿端点为外部节点的xc构造完成");
                                            console.log(pw_Data2);

                                            eline.pw.push(pw_Data2);
                                        }

                                    }
                                    //*******xc构造 start*******//

                                    //*******路径策略构造 start*******//
                                    if ($scope.extSlaveXcList[f]['ne-id'] !== undefined && $scope.extSlaveXcList[f]['ne-id'] !== "") {
                                        var proCalculateXC = {
                                            "ne-id": $scope.extSlaveXcList[f]['ne-id']
                                        };

                                        if ($scope.extSlaveXcList[f]['srcLinkId'] !== undefined && $scope.extSlaveXcList[f]['srcLinkId'] !== "") {
                                            //link
                                            //                      eline['calculate-constraint']['protect-calculate-constraint']['explicit-include-link']['explicit-include-link-list'].push({'link-id':$scope.extSlaveXcList[f]['srcLinkId']});
                                            //ne
                                            proCalculateXC['forward-in-label'] = $scope.extSlaveXcList[f]['forward-in-label'];
                                            proCalculateXC['backward-out-label'] = $scope.extSlaveXcList[f]['backward-out-label'];
                                            proCalculateXC['ingress-vlan'] = $scope.extSlaveXcList[f]['ingress-vlan'];
                                        }
                                        if ($scope.extSlaveXcList[f]['desLinkId'] !== undefined && $scope.extSlaveXcList[f]['desLinkId'] !== "") {
                                            //link
                                            //                      eline['calculate-constraint']['protect-calculate-constraint']['explicit-include-link']['explicit-include-link-list'].push({'link-id':$scope.extSlaveXcList[f]['desLinkId']});
                                            //ne
                                            proCalculateXC['forward-out-label'] = $scope.extSlaveXcList[f]['forward-out-label'];
                                            proCalculateXC['backward-in-label'] = $scope.extSlaveXcList[f]['backward-in-label'];
                                            proCalculateXC['egress-vlan'] = $scope.extSlaveXcList[f]['egress-vlan'];
                                        }

                                        eline['calculate-constraint']['protect-calculate-constraint']['explicit-include-ne']['explicit-include-ne-list'].push(proCalculateXC);
                                    }
                                    //*******路径策略构造 end*******//
                                }

                            }
                            //******************************pw-xc及路径策略构造 end**********************************//
                            //            eline.pw.push(pwData);            
                        }
                        removeUserLabel(eline);
                        TunnelSvc.createEline(eline);
                    } else {
                        if (autoCreFlag !== true) {
                            for (var k in eline.pw) {
                                //          alert("开始pw");
                                eline.pw[k].id = createUUID();
                                eline.pw[k]['encaplate-type'] = "cep-mpls";
                                eline.pw[k]['ctrl-word-support'] = "nonsupport";
                                eline.pw[k]['sn-support'] = "support";
                                eline.pw[k]['vccv-type'] = "nonsupport";
                                eline.pw[k]['conn-ack-type'] = "none";
                                eline.pw[k]['admin-status'] = "admin-up";
                                eline.pw[k]['operate-status'] = "operate-up";
                                eline.pw[k].route[0].id = "1";
                                eline.pw[k].route[0]['layer-rate'] = "pw";
                                //add CC/BFD OAM
                                if (eline.pw[k].oam != null) {
                                    switch ($scope.curOamType) {
                                        case "cc":
                                            eline.pw[k].oam['belonged-id'] = k + 1;
                                            eline.pw[k].oam.name = k;
                                            var tmpNum2 = Math.round(Math.random() * 10000) + 1;
                                            eline.pw[k].oam['meg-id'] = tmpNum2;
                                            eline.pw[k].oam['meps'] = [{
                                                'id': 1,
                                                'name': 1
                                            }, {
                                                'id': 2,
                                                'name': 2
                                            }];
                                            break;
                                        case "bfd":
                                            //                eline.pw[k].oam['ttl'] = $scope.autoOamData['ttl'];
                                            //                eline.pw[k].oam['localtxinterval'] = $scope.autoOamData['localtxinterval'];
                                            break;

                                    }

                                }

                                if (eline.proctection !== undefined) {
                                    //xc中添加pw-label
                                    if (eline.proctection['linear-protection-protocol'] === "NONE") {
                                        if ($scope.extMasterXcList !== undefined && $scope.extMasterXcList.length !== undefined && $scope.extMasterXcList.length > 1) {
                                            for (var m = 0; m < $scope.extMasterXcList.length; m++) {
                                                if ($scope.extMasterXcList[m]['ne-id'] === (eline['egress-end-points'][0]['ltp-id'].substring(0, eline['egress-end-points'][0]['ltp-id'].lastIndexOf(":")))) {
                                                    /* if($scope.extMasterXcList[m]['des-pw-label']!==undefined){
                                                      
                                                    } */
                                                    if ($scope.extMasterXcList[m]['src-pw-label'] !== undefined) {
                                                        if (eline.pw[k]['egress-ne-id'] === $scope.extMasterXcList[m]['ne-id'] && eline.pw[k]['role'] === "master") {
                                                            eline.pw[k]['route'][0].xc[0]['forward-out-label'] = $scope.extMasterXcList[m]['src-pw-label'];
                                                            eline.pw[k]['route'][0].xc[0]['backword-out-label'] = $scope.extMasterXcList[m]['src-pw-label'];
                                                            eline.pw[k]['route'][0].xc[1]['forward-in-label'] = $scope.extMasterXcList[m]['src-pw-label'];
                                                            eline.pw[k]['route'][0].xc[1]['backword-out-label'] = $scope.extMasterXcList[m]['src-pw-label'];
                                                        }
                                                    }
                                                }
                                                //若egress-ne-id有两个
                                                if (eline['egress-end-points'].length === 2) {
                                                    if ($scope.extMasterXcList[m]['ne-id'] === (eline['egress-end-points'][1]['ltp-id'].substring(0, eline['egress-end-points'][1]['ltp-id'].lastIndexOf(":")))) {
                                                        if ($scope.extMasterXcList[m]['src-pw-label'] !== undefined) {
                                                            if (eline.pw[k]['egress-ne-id'] === $scope.extMasterXcList[m]['ne-id'] && eline.pw[k]['role'] === "master") {
                                                                eline.pw[k]['route'][0].xc[0]['forward-out-label'] = $scope.extMasterXcList[m]['src-pw-label'];
                                                                eline.pw[k]['route'][0].xc[0]['backword-out-label'] = $scope.extMasterXcList[m]['src-pw-label'];
                                                                eline.pw[k]['route'][0].xc[1]['forward-in-label'] = $scope.extMasterXcList[m]['src-pw-label'];
                                                                eline.pw[k]['route'][0].xc[1]['backword-out-label'] = $scope.extMasterXcList[m]['src-pw-label'];
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                        if ($scope.extSlaveXcList !== undefined && $scope.extSlaveXcList.length !== undefined && $scope.extSlaveXcList.length > 1) {
                                            for (var s = 0; s < $scope.extSlaveXcList.length; s++) {
                                                if ($scope.extSlaveXcList[s]['ne-id'] === (eline['egress-end-points'][0]['ltp-id'].substring(0, eline['egress-end-points'][0]['ltp-id'].lastIndexOf(":")))) {
                                                    if ($scope.extSlaveXcList[s]['src-pw-label'] !== undefined) {
                                                        if (eline.pw[k]['egress-ne-id'] === $scope.extSlaveXcList[s]['ne-id'] && eline.pw[k]['role'] === "slave") {
                                                            eline.pw[k]['route'][0].xc[0]['forward-out-label'] = $scope.extSlaveXcList[s]['src-pw-label'];
                                                            eline.pw[k]['route'][0].xc[0]['backword-out-label'] = $scope.extSlaveXcList[s]['src-pw-label'];
                                                            eline.pw[k]['route'][0].xc[1]['forward-in-label'] = $scope.extSlaveXcList[s]['src-pw-label'];
                                                            eline.pw[k]['route'][0].xc[1]['backword-out-label'] = $scope.extSlaveXcList[s]['src-pw-label'];
                                                        }
                                                    }
                                                }
                                                //若egress-ne-id有两个
                                                if (eline['egress-end-points'].length === 2) {
                                                    if ($scope.extSlaveXcList[s]['ne-id'] === (eline['egress-end-points'][1]['ltp-id'].substring(0, eline['egress-end-points'][1]['ltp-id'].lastIndexOf(":")))) {
                                                        if ($scope.extSlaveXcList[s]['src-pw-label'] !== undefined) {
                                                            if (eline.pw[k]['egress-ne-id'] === $scope.extSlaveXcList[s]['ne-id'] && eline.pw[k]['role'] === "master") {
                                                                eline.pw[k]['route'][0].xc[0]['forward-out-label'] = $scope.extSlaveXcList[s]['src-pw-label'];
                                                                eline.pw[k]['route'][0].xc[0]['backword-out-label'] = $scope.extSlaveXcList[s]['src-pw-label'];
                                                                eline.pw[k]['route'][0].xc[1]['forward-in-label'] = $scope.extSlaveXcList[s]['src-pw-label'];
                                                                eline.pw[k]['route'][0].xc[1]['backword-out-label'] = $scope.extSlaveXcList[s]['src-pw-label'];
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }


                                    //初始化路径策略构造
                                    if ((eline.proctection['linear-protection-protocol'] === "NONE") && (($scope.extMasterXcList.length !== undefined) || ($scope.extSlaveXcList.length !== undefined))) {
                                        eline['calculate-constraint'] = {};
                                        if ($scope.extMasterXcList.length !== undefined) {
                                            var tmpWorkCal = {
                                                //                'explicit-include-link':{
                                                //                  'explicit-include-link-list':[]
                                                //                },
                                                'explicit-include-ne': {
                                                    'explicit-include-ne-list': []
                                                }
                                            };
                                            eline['calculate-constraint']['work-calculate-constraint'] = tmpWorkCal;
                                        }
                                        if ($scope.extSlaveXcList.length !== undefined) {
                                            var tmpSlaveCal = {
                                                //                'explicit-include-link':{
                                                //                  'explicit-include-link-list':[]
                                                //                },
                                                'explicit-include-ne': {
                                                    'explicit-include-ne-list': []
                                                }
                                            };
                                            eline['calculate-constraint']['protect-calculate-constraint'] = tmpSlaveCal;
                                        }
                                    }

                                    //*******路径策略构造 start*******//
                                    if ($scope.extMasterXcList.length !== undefined) {
                                        for (var o = 0; o < $scope.extMasterXcList.length; o++) {
                                            if ($scope.extMasterXcList[o]['ne-id'] !== undefined && $scope.extMasterXcList[o]['ne-id'] !== "") {
                                                var workCalXC = {
                                                    "ne-id": $scope.extMasterXcList[o]['ne-id']
                                                };
                                                if (($scope.extMasterXcList[o]['srcLinkId'] !== undefined && $scope.extMasterXcList[o]['srcLinkId'] !== "") || ($scope.extMasterXcList[o]['desLinkId'] !== undefined && $scope.extMasterXcList[o]['desLinkId'] !== "")) {

                                                }
                                                if ($scope.extMasterXcList[o]['srcLinkId'] !== undefined && $scope.extMasterXcList[o]['srcLinkId'] !== "") {
                                                    //link                    
                                                    //                  eline['calculate-constraint']['work-calculate-constraint']['explicit-include-link']['explicit-include-link-list'].push({'link-id':$scope.extMasterXcList[o]['srcLinkId']});
                                                    //ne
                                                    workCalXC['forward-in-label'] = $scope.extMasterXcList[o]['forward-in-label'];
                                                    workCalXC['backward-out-label'] = $scope.extMasterXcList[o]['backward-out-label'];
                                                    workCalXC['ingress-vlan'] = $scope.extMasterXcList[o]['ingress-vlan'];
                                                }
                                                if ($scope.extMasterXcList[o]['desLinkId'] !== undefined && $scope.extMasterXcList[o]['desLinkId'] !== "") {
                                                    //link
                                                    //                  eline['calculate-constraint']['work-calculate-constraint']['explicit-include-link']['explicit-include-link-list'].push({'link-id':$scope.extMasterXcList[o]['desLinkId']});
                                                    //ne
                                                    workCalXC['forward-out-label'] = $scope.extMasterXcList[o]['forward-out-label'];
                                                    workCalXC['backward-in-label'] = $scope.extMasterXcList[o]['backward-in-label'];
                                                    workCalXC['egress-vlan'] = $scope.extMasterXcList[o]['egress-vlan'];
                                                }

                                                eline['calculate-constraint']['work-calculate-constraint']['explicit-include-ne']['explicit-include-ne-list'].push(workCalXC);
                                            }
                                        }
                                    }

                                    if ($scope.extSlaveXcList.length !== undefined) {
                                        for (var h = 0; h < $scope.extSlaveXcList.length; h++) {
                                            if ($scope.extSlaveXcList[h]['ne-id'] !== undefined && $scope.extSlaveXcList[h]['ne-id'] !== "") {
                                                var proCalXC = {
                                                    "ne-id": $scope.extSlaveXcList[h]['ne-id']
                                                };

                                                if ($scope.extSlaveXcList[h]['srcLinkId'] !== undefined && $scope.extSlaveXcList[h]['srcLinkId'] !== "") {
                                                    //link
                                                    //                  eline['calculate-constraint']['protect-calculate-constraint']['explicit-include-link']['explicit-include-link-list'].push({'link-id':$scope.extSlaveXcList[h]['srcLinkId']});
                                                    //ne
                                                    proCalXC['forward-in-label'] = $scope.extSlaveXcList[h]['forward-in-label'];
                                                    proCalXC['backward-out-label'] = $scope.extSlaveXcList[h]['backward-out-label'];
                                                    proCalXC['ingress-vlan'] = $scope.extSlaveXcList[h]['ingress-vlan'];
                                                }
                                                if ($scope.extSlaveXcList[h]['desLinkId'] !== undefined && $scope.extSlaveXcList[h]['desLinkId'] !== "") {
                                                    //link
                                                    //                  eline['calculate-constraint']['protect-calculate-constraint']['explicit-include-link']['explicit-include-link-list'].push({'link-id':$scope.extSlaveXcList[h]['desLinkId']});
                                                    //ne
                                                    proCalXC['forward-out-label'] = $scope.extSlaveXcList[h]['forward-out-label'];
                                                    proCalXC['backward-in-label'] = $scope.extSlaveXcList[h]['backward-in-label'];
                                                    proCalXC['egress-vlan'] = $scope.extSlaveXcList[h]['egress-vlan'];
                                                }

                                                eline['calculate-constraint']['protect-calculate-constraint']['explicit-include-ne']['explicit-include-ne-list'].push(proCalXC);
                                            }
                                        }
                                    }
                                    //*******路径策略构造 start*******//
                                }
                            }
                            removeUserLabel(eline);
                            TunnelSvc.createEline(eline);
                        }
                    }
                };

                $scope.stateLoad = function() {
                    $state.go('main.tunnel.index', null, { reload: true });
                };

                $scope.addIngress = function() {
                    var obj = {};
                    $scope.eline['ingress-end-points'].push(obj);
                };

                $scope.addEgress = function(idx) {
                    var obj = {};
                    $scope.eline['egress-end-points'].push(obj);
                };

                $scope.removeIngress = function(idx) {
                    console.log("Ingress Id" + idx);
                    if ($scope.eline['ingress-end-points'].length > 1) {
                        $scope.eline['ingress-end-points'].splice(idx, 1);
                    }
                };

                $scope.removeEgress = function(idx) {
                    console.log("Egress Id" + idx);
                    if ($scope.eline['egress-end-points'].length > 1) {
                        $scope.eline['egress-end-points'].splice(idx, 1);
                    }
                };

                //addprotection
                $scope.addCProtection = function() {

                    while ($scope.eline.pw.length < 2) {
                        $scope.addPw();
                    }
                    $scope.protctionShow = true;
                };

                $scope.removeCProtection = function() {
                    for (var i in $scope.eline.pw) {
                        if (i > 0) {
                            $scope.eline.pw.splice(i, 1);
                        }
                    }
                    delete $scope.eline.protection;
                    $scope.protctionShow = false;
                };
                //addoam
                $scope.addElineOam = function(id) {
                    $scope.elineOamshow[id] = true;
                    if ($scope.eline.pw[id].oam !== null && $scope.eline.pw[id].oam !== undefined) {
                        //           alert("oam is already in this pw!");
                    } else {
                        //    $scope.eline.pw[id].oam.add(oam);
                        if ($scope.curOamType === "cc") {
                            $scope['ccShow' + id] = true;
                        } else if ($scope.curOamType === "bfd") {
                            $scope['bfdShow' + id] = true;
                        }
                        $scope.eline.pw[id].oam = {
                            //          "meg-id":++curMepId,
                            //          "cc-exp":"CS7",
                            //          meps:[{},
                            //               {}],
                            //          "cc-interval": "100",
                            //          "lm-mode": "disable",
                            //          "dm-mode": "disable"
                        };
                    }
                    //原型
                    /* $scope['ccShow'+ = false;
                    $scope.bfdShow = false; */

                };

                $scope.removeElineOam = function(id) {
                    $scope.elineOamshow[id] = false;
                    //      curMepId--;
                    if ($scope.eline.pw[id].oam === null || $scope.eline.pw[id].oam === undefined) {
                        alert("oam is not in this pw!");
                    } else {
                        delete $scope.eline.pw[id].oam;
                    }
                };

                $scope.toggle = function(id) {
                    $('#btn-' + id).toggleClass('expandIconArrowUp');
                    $('#btn-' + id).toggleClass('expandIconArrowDown');
                    $('#' + id).slideToggle("fast");
                };

                $scope.addPw = function() {
                    var pw = {
                        'role': 'master',
                        "tunnel-ids": [{}],
                        route: [{
                                xc: [{},
                                    {}
                                ]
                            }]
                            /* oam: {
                                'cc-exp': 'CS7',
                                meps:[{},
                                      {}],
                                'cc-interval': '100',
                                'lm-mode': 'disable',
                                'dm-mode': 'disable'
                            } */
                    };
                    $scope.eline.pw.push(pw);
                };

                $scope.addXc = function(idx) {
                    var obj = {};
                    $scope.eline.pw[idx].route[0].xc.push(obj);
                };

                $scope.removePw = function(idx) {
                    $scope.eline.pw.splice(idx, 1);
                };
                $scope.removeXc = function(pidx, idx) {
                    $scope.eline.pw[pidx].route[0].xc.splice(idx, 1);
                };
                /*$scope.changeXc = function(id,num){
if(num === 0){
      $scope.eline.pw[id].route[0].xc[num]['ne-id'] = $scope.eline.pw[id]['ingress-ne-id'];
      }else{
        $scope.eline.pw[id].route[0].xc[num]['ne-id'] = $scope.eline.pw[id]['egress-ne-id'];
      }
      $scope.changeLtp(id,num);
    };*/

                $scope.addTunnelId = function(id) {
                    var obj = {};

                    $scope.eline.pw[id]['tunnel-ids'].push(obj);
                };

                $scope.removeTunnel = function(pid, id) {
                    $scope.eline.pw[pid]['tunnel-ids'].splice(id, 1);
                };

                $scope.changeLtp = function(pid, id) {
                    var nodeId = $scope.eline.pw[pid].route[0].xc[id]['ne-id'];
                    /*if (id === 0) {
                                  $scope.eline.pw[pid]['ingress-ne-id'] = nodeId;
                              } else if (id === 1) {
                                  $scope.eline.pw[pid]['egress-ne-id'] = nodeId;
                              }*/
                    if ($scope.ports[pid] == null) {
                        $scope.ports[pid] = [];
                    }
                    var node = _.find($scope.nodes,
                        function(entry) {
                            if (entry.id == nodeId) {
                                return entry;
                            }
                        });
                    $scope.ports[pid][id] = node['node-connector'];
                };

                $scope.addPoints = function() {
                    var obj = {};
                    $scope.eline['ingress-end-points'].push(obj);
                    $scope.eline['egress-end-points'].push(obj);
                };

                $scope.removePoints = function(id) {
                    $scope.eline['ingress-end-points'].splice(id, 1);
                    $scope.eline['egress-end-points'].splice(id, 1);
                };

                //***********************************************自动创建+BFD+PW冗余************************************************//

                $scope.proTypes = [{ id: 'path-protection-1-to-1' }, { id: '1:1 trail protection' }, { id: '1:1 trail protection' }, { id: 'path-protection-1-plus-1' }, { id: ' permanent-1-to-1-protection' }, { id: 'permanent-1-plus-1-protection' }];

                $scope.pwAutoProctectTypes = [{ id: '无保护' }, { id: 'lsp 1:1 APS协议 保护' }, { id: 'lsp 1:1 PSC协议 保护' }, { id: 'pw 1:1 APS协议 保护' },
                    { id: 'pw 1:1 PSC协议 保护' }, { id: 'pw冗余' }
                ];
                /* {id:'unprotected'},
                {id:'lsp path-1-to-1 APS protection'},
                {id:'lsp path-1-to-1 PSC protection'},
                {id:'pw path-1-to-1 APS protection'},
                {id:'pw path-1-to-1 PSC protection'},
                {id:'pw path-1-to-1 NONE protection'} */
                $scope.pwCreateTypes = [{ id: '自动创建' }, { id: '手动创建' }];

                $scope.oamTypes = [{ id: 'cc' }, { id: 'bfd' }];

                $scope.autoCreateShow = false;

                $scope.autoProtectShow = false;

                $scope.xcListShow = true;

                $scope.baseTunnelIdShow = true;

                $scope.autoPwOamshow = false;

                $scope.autoXCList = [];

                $scope.xcListShow = true;

                $scope.routeStrategyShow = false;

                $scope.addRouteXcShow = false;

                $scope.extMasterXcList = [];

                $scope.extSlaveXcList = [];



                // 自动创建
                $scope.pwCreateType = function(type) {
                    //    if(type=="Auto Create"){
                    if (type == "自动创建") {
                        $scope.autoProtectShow = true;
                        $scope.autoCreateShow = false;
                        if ($scope.eline.pw !== undefined && $scope.eline.pw.length > 0) {
                            $scope.eline.pw.splice(0, $scope.eline.pw.length);
                        }

                        //    }else if(type=="Manually Create"){
                    } else if (type == "手动创建") {
                        $scope.autoProtectShow = false;
                        $scope.autoCreateShow = true;
                        $scope.xcListShow = true;
                        $scope.routeStrategyShow = true;
                        $scope.xcMasterShow = true;
                        $scope.xcSlaveshow = true;
                        $scope.autoPwOamshow = false;
                        //      $scope.routeStrategyShow = false;
                        if ($scope.eline.pw !== undefined && $scope.eline.pw.length < 1) {
                            $scope.addPw();
                        }

                    }
                    console.log(type);
                };

                $scope.elineAutoCreateType = function(type) {
                    if (type === "pw冗余") {
                        $scope.oamAutoCreType = true;
                        $scope.autoPwOamshow = true;
                        $scope.xcListShow = true;
                        $scope.routeStrategyShow = true;
                        $scope.xcMasterShow = true;
                        $scope.xcSlaveshow = true;
                    } else {
                        $scope.xcMasterShow = true;
                        $scope.xcListShow = true;
                        $scope.routeStrategyShow = true;
                        $scope.xcSlaveshow = true;
                        $scope.autoPwOamshow = true;
                    }
                };

                $scope.autoOamTypeChange = function(type, index) {
                    if (type == "cc") {
                        $scope['autoCcShow'] = true;
                        $scope['autoBfdShow'] = false;
                    } else if (type == "bfd") {
                        $scope['autoCcShow'] = false;
                        $scope['autoBfdShow'] = true;
                    }
                };

                $scope.addAutoOam = function() {
                    $scope.addAutoOamshow = true;
                };

                $scope.removeAutoOam = function() {
                    $scope.autoOamData = {};
                    $scope.curAutoOamType = "";
                    $scope.addAutoOamshow = false;
                    $scope.autoCcShow = false;
                    $scope.autoBfdShow = false;
                };



                /****************添加外部节点 start**************/
                $scope.toggleRoute = function(index) {
                    if ($scope.addRouteXcShow === true) {
                        $scope.addRouteXcShow = false;
                        $scope.xcListShow = false;
                    } else {
                        $scope.addRouteXcShow = true;
                        $scope.xcListShow = true;
                    }
                };

                $scope.expandMasterXC = function(index) {
                    if ($scope.extMasterXcList[index]['show'] === undefined || $scope.extMasterXcList[index]['show'] === false) {
                        $scope.extMasterXcList[index]['show'] = true;
                    } else {
                        $scope.extMasterXcList[index]['show'] = false;
                    }
                };

                $scope.expandSlaveXC = function(index) {
                    if ($scope.extSlaveXcList[index]['show'] === undefined || $scope.extSlaveXcList[index]['show'] === false) {
                        $scope.extSlaveXcList[index]['show'] = true;
                    } else {
                        $scope.extSlaveXcList[index]['show'] = false;
                    }
                };

                $scope.addMasterRouteXc = function() {
                    var curLength = $scope.extMasterXcList.length;
                    $scope.extMasterXcList.push({});
                    //新添加的xc其参数属性隐藏
                    $scope['srcMasterExtLinkShow' + curLength] = true;
                    $scope['desMasterExtLinkShow' + curLength] = true;
                };

                $scope.addSlaveRouteXc = function() {
                    var curLength2 = $scope.extSlaveXcList.length;
                    $scope.extSlaveXcList.push({});
                    //新添加的xc其参数属性隐藏
                    $scope['srcSlaveExtLinkShow' + curLength2] = true;
                    $scope['desSlaveExtLinkShow' + curLength2] = true;
                };

                $scope.removeMasterRouteXc = function(index) {
                    $scope.extMasterXcList.splice(index, 1);
                };

                $scope.removeSlaveRouteXc = function(index) {
                    $scope.extSlaveXcList.splice(index, 1);
                };


                //  $scope.extLinkList = [{id:11},{id:22}];


                $scope.rightExtShow = true;
                $scope.leftExtShow = true;

                //下拉选择外部节点
                $scope.changeMasterNode = function(index) {

                    console.log("Select ext node id:" + $scope.extNodeList[index].id);

                };

                //下拉选择左右外部link
                $scope.changeMasterSrcExtLink = function(index) {

                    $scope['srcMasterExtLinkShow' + index] = false;
                };

                $scope.changeMasterDesExtLink = function(index) {

                    $scope['desMasterExtLinkShow' + index] = false;
                };

                $scope.changeSlaveSrcExtLink = function(index) {

                    $scope['srcSlaveExtLinkShow' + index] = false;
                };

                $scope.changeSlaveDesExtLink = function(index) {

                    $scope['desSlaveExtLinkShow' + index] = false;
                };



                /****************添加外部节点 end**************/

                //BFD 
                $scope.oamTypeChange = function(type, index) {
                    //    var type = $scope.oamTypes[parIndex];
                    var obj = { 'id': type };

                    if (type == "cc") {
                        $scope['ccShow' + index] = true;
                        $scope['bfdShow' + index] = false;
                        $scope.curOamType = "cc";
                    } else if (type == "bfd") {
                        $scope['ccShow' + index] = false;
                        $scope['bfdShow' + index] = true;
                        $scope.curOamType = "bfd";
                    }
                };

                //永久保护
                $scope.selProtectType = function(type) {
                    //    var type = $scope.proTypes[parIndex]['id'];
                    console.log(type);
                    if (type == "Forever Protection") {
                        $scope.xcListShow = false;
                    } else if (type == "Normal Protection") {
                        $scope.xcListShow = true;
                    }
                };

                //***********************************************自动创建+BFD+PW冗余************************************************//

            });
    });
