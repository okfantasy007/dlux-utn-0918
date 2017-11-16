define(['app/tunnel/tunnel.module'],
    function(tunnel) {

        tunnel.register.factory('TunnelRestangular',
            function(Restangular, ENV) {
                return Restangular.withConfig(function(RestangularConfig) {
                    RestangularConfig.setBaseUrl(ENV.getBaseURL("MD_SAL"));
                });
            });

        tunnel.register.factory('TunnelSvc',
            function(TunnelRestangular, $state, $filter) {
                var svc = {
                    base: function() {
                        return TunnelRestangular.one('restconf').one('operations');
                    },
                    baseElines: function() {
                        return TunnelRestangular.one('restconf').one('operational').one('raisecom-eline:service');
                    },
                    baseTunnels: function() {
                        return TunnelRestangular.one('restconf').one('operational').one('raisecom-tunnel:service');
                    },
                    baseSwitchs: function() {
                        return TunnelRestangular.one('restconf').one('operational').one('opendaylight-inventory:nodes');
                    },
                    baseExtNodes: function() {
                        return TunnelRestangular.one('restconf').one('operational').one('sptn-net-topology:net-topology/ext-nodes');
                    },
                    baseExtLinks: function() {
                        return TunnelRestangular.one('restconf').one('operational').one('sptn-net-topology:net-topology/ext-links');
                    },
                    protectionstatus: null,
                    switchs: null,
                    elines: null,
                    tunnels: null,
                    curTunnelId: 65537,
                    curLspId: 1,
                    curMepId: 1
                };


                //protectionstatus
                svc.getTunnelProtectionstatus = function(id) {
                    return svc.base().post('raisecom-tunnel:protection-link', { input: { 'tunnel-id': id } });
                };

                svc.getElineProtectionstatus = function(id) {
                    return svc.base().post('raisecom-eline:protection-link', { input: { 'eline-id': id } });
                };

                svc.getCurTunnelId = function() {
                    return svc.curTunnelId;
                };

                svc.getCurLspId = function() {
                    return svc.curLspId;
                };

                svc.getCurMepId = function() {
                    return svc.curMepId;
                };

                svc.getNodeUserLabelById = function(nodeId, cb) {
                    $.ajax({
                        url: TunnelRestangular.configuration.baseUrl + "/restconf/operational/opendaylight-inventory:nodes/node/" + nodeId,
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

                svc.getExtNodeUserLabelById = function(nodeId, cb) {
                    $.ajax({
                        url: TunnelRestangular.configuration.baseUrl + "/restconf/operational/sptn-net-topology:net-topology/ext-nodes/ext-node/" + nodeId,
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

                svc.getPortUserLabel = function(nodeId, portId, cb) {
                    $.ajax({
                        url: TunnelRestangular.configuration.baseUrl + "/restconf/operational/opendaylight-inventory:nodes/node/" + nodeId + "/node-connector/" + portId,
                        type: 'get',
                        async: false,
                        success: function(response) {
                            if (!response) {
                                console.log("no data!");
                            } else {
                                cb(response['node-connector'][0]['sdn-inventory:user-label']);
                            }
                        }
                    });
                };

                svc.createTunnel = function(tunnel) {
                    var lspnum = tunnel.lsp.length;
                    svc.base().post("raisecom-tunnel:create-tunnel", { input: tunnel }).then(function(response) {
                            if (response.output['add-tunnel-result'] === false) {
                                alert("create tunnel failed!");
                            } else {
                                alert("create tunnel success!");
                                svc.curTunnelId++;
                                svc.curMepId++;
                                svc.curLspId += lspnum;
                                $state.go('main.tunnel.index', null, { reload: true });
                            }
                        },
                        function(response) {
                            console.log(response);
                            alert(response.data.errors.error[0]['error-message']);
                        });
                };

                /*
            new add LM DM send
        */
                svc.LMDMSend = function(id, type, callback) {
                    svc.base().post('sal-netconf:' + type, { input: { 'service-id': id } }).then(function(response) {
                            var flag = response.output["result"];
                            if (flag) {
                                callback(flag, id);
                            } else {
                                alert('send failed!');
                            }
                        },
                        function(response) {
                            console.log(response);
                            alert(response.data.errors.error[0]['error-message']);
                        });
                };

                svc.LMDMAddBusiness = function(id, type) {
                    var params = { 'business-id': id, 'collect-intervals': 5 };
                    if (type === 'lm') {
                        params['collect-metric'] = ['packet-loss-rate'];
                    }
                    if (type === 'dm') {
                        params['collect-metric'] = ['delay'];
                    }
                    //var params = {'business-id':id,'collect-intervals':5,'collect-metric':['delay','packet-loss-rate','shake','bandwidth','availibity']};
                    svc.base().post('pm-task:add-pm-business-task', { input: params }).then(function(response) {
                            alert("start" + type + "success!");
                        },
                        function(response) {
                            console.log(response);
                            alert(response.data.errors.error[0]['error-message']);
                        });
                };

                svc.LMDMDeleteBusiness = function(id, type) {
                    var params = { 'business-id': id, 'collect-intervals': 5 };
                    if (type === 'lm') {
                        params['collect-metric'] = ['packet-loss-rate'];
                    }
                    if (type === 'dm') {
                        params['collect-metric'] = ['delay'];
                    }
                    svc.base().post('pm-task:remove-pm-business-task', { input: params }).then(function(response) {
                            alert("delete business success!");
                        },
                        function(response) {
                            console.log(response);
                            alert(response.data.errors.error[0]['error-message']);
                        });
                };

                //正确
                svc.createEline = function(eline) {
                    svc.base().post("raisecom-eline:create-snc-eline", {
                        input: eline
                    }).then(function(response) {
                            if (response.output['add-eline-result'] === true) {
                                //alert("创建eline成功!");
                                //添加LM,DM性能监控任务创建
                                for (var i in eline.pw) {
                                    if (eline.pw[i]['oam'] != null) {
                                        if (eline.pw[i]['oam']['lm-mode'] == 'on-demand') {
                                            svc.LMDMSend(eline.id, 'lm-start', svc.lmDmSendback);
                                        }

                                        if (eline.pw[i]['oam']['dm-mode'] == 'on-demand') {
                                            svc.LMDMSend(eline.id, 'dm-start', svc.lmDmSendback);
                                        }
                                    }
                                }
                                $("#testDevModal").modal('show');
                                //$state.go('main.tunnel.index',null,{reload:true});
                            } else {
                                alert("创建eline失败!");
                            }
                        },
                        function(response) {
                            alert("创建eline失败!");
                        });
                };

                /*
                //测试代码
                svc.createEline = function(eline) {
                    svc.base().post("raisecom-eline:create-snc-eline", {
                        input: eline
                    }).then(function(response) {
                            if (response.output['add-eline-result'] === true) {
                                //alert("创建eline成功!");
                                //添加LM,DM性能监控任务创建
                                for (var i in eline.pw) {
                                    if (eline.pw[i]['oam'] != null) {
                                        if (eline.pw[i]['oam']['lm-mode'] == 'on-demand') {
                                            svc.LMDMSend(eline.id, 'lm-start', svc.lmDmSendback);
                                        }

                                        if (eline.pw[i]['oam']['dm-mode'] == 'on-demand') {
                                            svc.LMDMSend(eline.id, 'dm-start', svc.lmDmSendback);
                                        }
                                    }
                                }
                                $("#testDevModal").modal('show');
                                //$state.go('main.tunnel.index',null,{reload:true});
                            } else {
                                // alert("创建eline失败!");
                                $("#testDevModal").modal('show');
                            }
                        },
                        function(response) {
                            alert("创建eline失败!");
                        });
                };
                */

                svc.createY1564 = function(y1564, cb) {
                    svc.base().post("y1564-api:enable-y1564", {
                        input: y1564
                    }).then(function(response) {
                            if (response.output['result'] === true) {
                                cb("success");
                            } else {
                                cb("failure");
                            }
                        },
                        function(response) {
                            console.log(response);
                            cb("failure");
                        });
                };

                svc.stopY1564 = function(eline) {
                    svc.base().post("y1564-api:stop-y1564", {
                        input: eline
                    }).then(function(response) {
                            if (response.output['result'] === true) {
                                alert($filter('translate')('stop y1564 success'));
                            } else {
                                alert($filter('translate')('stop y1564 failure'));
                            }
                        },
                        function(response) {
                            console.log(response);
                            alert($filter('translate')('stop y1564 failure'));
                        });
                };

                //Ext Nodes
                svc.getExtNodes = function(cb) {
                    $.ajax({
                        url: TunnelRestangular.configuration.baseUrl + "/restconf/operational/sptn-net-topology:net-topology/ext-nodes",
                        contentType: "application/json",
                        type: 'get',
                        async: false,
                        dataType: "json",
                        success: function(response) {
                            var resultList = response['ext-nodes']['ext-node'];
                            if (resultList === undefined) {
                                console.log("The ext-nodes has no data!");
                            } else {
                                cb(resultList);
                            }
                        }
                    });
                };

                //Ext Links
                svc.getExtLinks = function(cb) {
                    $.ajax({
                        url: TunnelRestangular.configuration.baseUrl + "/restconf/operational/sptn-net-topology:net-topology/ext-links",
                        contentType: "application/json",
                        type: 'get',
                        async: false,
                        dataType: "json",
                        success: function(response) {
                            var resultList = response['ext-links']['ext-link'];
                            if (resultList === undefined) {
                                console.log("The ext-links has no data!");
                            } else {
                                cb(resultList);
                            }
                        }
                    });
                };

                svc.lmDmSendback = function(success, id) {
                    if (success) {
                        svc.LMDMAddBusiness(id);
                    }
                };


                svc.getElines = function() {
                    svc.elines = svc.baseElines().getList();
                    return svc.elines;
                };

                svc.getCurrentElines = function() {
                    return svc.elines;
                };

                svc.getTunnels = function() {
                    svc.tunnels = svc.baseTunnels().getList();
                    return svc.tunnels;
                };

                svc.getCurrentTunnels = function() {
                    return svc.tunnels;
                };

                svc.getSwitchs = function() {
                    svc.switchs = svc.baseSwitchs().getList();
                    return svc.switchs;
                };

                svc.getCurrentSwitchs = function() {
                    return svc.switchs;
                };

                svc.removeEline = function(id, index) {
                    svc.base().post("raisecom-eline:delete-snc-eline", {
                        input: { "id": id }
                    }).then(function() {
                            alert("delete eline success!");
                            $('#elineIndex' + index).hide("fast");
                            $state.reload();
                        },
                        function(response) {
                            alert(response.data.errors.error[0]['error-message']);
                        });


                    // $.ajax({
                    //     url: TunnelRestangular.configuration.baseUrl + "/restconf/operations/raisecom-eline:delete-snc-eline",
                    //     contentType: "application/json",
                    //     type: 'post',
                    //     async: false,
                    //     dataType: "json",
                    //     data: JSON.stringify({
                    //         input: { "id": id }
                    //     }),
                    //     success: function(response) {
                    //         alert("delete eline success!");
                    //         $('#elineIndex' + index).hide();
                    //     }

                    // });
                };

                svc.removeTunnel = function(id, index) {
                    svc.base().post("raisecom-tunnel:delete-tunnel", {
                        input: { "id": id }
                    }).then(function(response) {
                            //
                            // if (response.output !== "undefined" && response.output.error !== "undefined") {
                            //     alert("delete tunnel failed !" + response.output.error[0]['error-message']);
                            // } else {
                            //     alert("delete tunnel success!");
                            //     $('#tunnelIndex' + index).hide("fast");
                            //     $state.reload();
                            // }
                            //如果response.output为空对象，则表示删除成功
                            if (response.output && $.isEmptyObject(response.output)) {
                                alert("delete tunnel success!");
                                $('#tunnelIndex' + index).hide("fast");
                                $state.reload();
                            } else if (response.output.error) {
                                alert("delete tunnel failed !" + response.output.error[0]['error-message']);
                            }

                        },
                        function(response) {
                            alert("delete tunnel failed !");
                        });
                };

                svc.updateQos = function(qos, cb) {
                    svc.base().post("raisecom-eline:update-qos", { input: qos }).then(function() {
                            alert("Update Qos success!");
                            //        $state.go('main.tunnel.index',null,{reload:false});
                            cb("Success");
                        },
                        function(response) {
                            console.log(response);
                            alert("Add/Update Qos Failed!");
                            cb("Error");
                        });
                };

                svc.removeQos = function(delId, cb) {
                    svc.base().post("raisecom-eline:del-qos", { input: delId }).then(function() {
                            alert("Delete Qos success!");
                            cb("Success");
                            //        $state.go('main.tunnel.index',null,{reload:true});
                        },
                        function(response) {
                            console.log(response);
                            alert("Delete Qos Failed!");
                            cb("Error");
                            //        alert(response.data.errors.error[0]['error-message']);
                        });
                };
                svc.startLb = function(lb, cb) {
                    svc.base().post("sal-netconf:lb-start",
                        JSON.stringify({ 'input': lb })
                    ).then(function(response) {
                        if (response.output.result === true) {
                            alert("start lb success!");
                            cb(response.output['lb-id']);
                        } else {
                            cb("Error");
                        }
                    }, function(response) {
                        cb("Error");
                    });
                };

                svc.lbStop = function(lbparams, cb) {
                    svc.base().post("sal-netconf:lb-stop", {
                        input: lbparams
                    }).then(function(response) {
                            //console.log(response);
                            if (response.output.result === true) {
                                cb("success");
                            } else {
                                alert("Stop lb failed");
                                cb("error");
                            }
                        },
                        function(response) {
                            alert("Stop lb failed");
                            cb("error");
                        });
                };
                svc.lbDelete = function(lbparams, cb) {
                    svc.base().post("sal-netconf:lb-del", {
                        input: lbparams
                    }).then(function(response) {
                            if (response.output.result === true) {
                                cb("success");
                                alert("delete lb success!");
                            } else {
                                cb("error");
                                alert("delete lb failed!");
                            }
                        },
                        function(response) {
                            cb("error");
                            alert(response.data.errors.error[0]['error-message']);
                        });
                };

                svc.getLbStatus = function(lbparams, cb) {
                    svc.base().post("sal-netconf:lb-status", {
                        input: lbparams
                    }).then(function(response) {
                            console.log("get status success");
                            cb(response);
                        },
                        function(response) {
                            alert("Get lb status error!");
                            //            alert(response.data.errors.error[0]['error-message']);
                        });
                };


                svc.forcedPro = function(id, cmdType) {

                    svc.base().post("sal-netconf:forced-protection", { input: { 'tunnel-id': id, 'ps-command-type': cmdType } }).then(function(response) {
                        var success = response.output["forced-protection-result"];
                        if (success) {
                            alert("forced protection success!");
                        } else {
                            alert("forced protection fail!");
                        }
                    }, function(response) {
                        alert(response.data.errors.error[0]['error-message']);
                    });

                };
                return svc;
            });

    });
