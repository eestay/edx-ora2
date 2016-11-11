if (typeof OpenAssessment == "undefined" || !OpenAssessment) {
    OpenAssessment = {}
}
if (typeof window.gettext === "undefined") {
    window.gettext = function(text) {
        return text
    }
}
if (typeof window.ngetgext === "undefined") {
    window.ngettext = function(singular_text, plural_text, n) {
        if (n > 1) {
            return plural_text
        } else {
            return singular_text
        }
    }
}
if (typeof window.Logger === "undefined") {
    window.Logger = {
        log: function() {}
    }
}
if (typeof window.MathJax === "undefined") {
    window.MathJax = {
        Hub: {
            Typeset: function() {},
            Queue: function() {}
        }
    }
}
if (typeof OpenAssessment.Server === "undefined" || !OpenAssessment.Server) {
    OpenAssessment.Server = function(runtime, element) {
        this.runtime = runtime;
        this.element = element
    };
    var jsonContentType = "application/json; charset=utf-8";
    OpenAssessment.Server.prototype = {
        url: function(handler) {
            return this.runtime.handlerUrl(this.element, handler)
        },
        render: function(component) {
            var view = this;
            var url = this.url("render_" + component);
            return $.Deferred(function(defer) {
                $.ajax({
                    url: url,
                    type: "POST",
                    dataType: "html"
                }).done(function(data) {
                    defer.resolveWith(view, [data])
                }).fail(function() {
                    defer.rejectWith(view, [gettext("This section could not be loaded.")])
                })
            }).promise()
        },
        renderLatex: function(element) {
            element.filter(".allow--latex").each(function() {
                MathJax.Hub.Queue(["Typeset", MathJax.Hub, this])
            })
        },
        renderContinuedPeer: function() {
            var view = this;
            var url = this.url("render_peer_assessment");
            return $.Deferred(function(defer) {
                $.ajax({
                    url: url,
                    type: "POST",
                    dataType: "html",
                    data: {
                        continue_grading: true
                    }
                }).done(function(data) {
                    defer.resolveWith(view, [data])
                }).fail(function() {
                    defer.rejectWith(view, [gettext("This section could not be loaded.")])
                })
            }).promise()
        },
        studentInfo: function(student_username) {
            var url = this.url("render_student_info");
            return $.Deferred(function(defer) {
                $.ajax({
                    url: url,
                    type: "POST",
                    dataType: "html",
                    data: {
                        student_username: student_username
                    }
                }).done(function(data) {
                    defer.resolveWith(this, [data])
                }).fail(function() {
                    defer.rejectWith(this, [gettext("This section could not be loaded.")])
                })
            }).promise()
        },
        submit: function(submission) {
            var url = this.url("submit");
            return $.Deferred(function(defer) {
                $.ajax({
                    type: "POST",
                    url: url,
                    data: JSON.stringify({
                        submission: submission
                    }),
                    contentType: jsonContentType
                }).done(function(data) {
                    var success = data[0];
                    if (success) {
                        var studentId = data[1];
                        var attemptNum = data[2];
                        defer.resolveWith(this, [studentId, attemptNum])
                    } else {
                        var errorNum = data[1];
                        var errorMsg = data[2];
                        defer.rejectWith(this, [errorNum, errorMsg])
                    }
                }).fail(function() {
                    defer.rejectWith(this, ["AJAX", gettext("This response could not be submitted.")])
                })
            }).promise()
        },
        save: function(submission) {
            var url = this.url("save_submission");
            return $.Deferred(function(defer) {
                $.ajax({
                    type: "POST",
                    url: url,
                    data: JSON.stringify({
                        submission: submission
                    }),
                    contentType: jsonContentType
                }).done(function(data) {
                    if (data.success) {
                        defer.resolve()
                    } else {
                        defer.rejectWith(this, [data.msg])
                    }
                }).fail(function() {
                    defer.rejectWith(this, [gettext("This response could not be saved.")])
                })
            }).promise()
        },
        submitFeedbackOnAssessment: function(text, options) {
            var url = this.url("submit_feedback");
            var payload = JSON.stringify({
                feedback_text: text,
                feedback_options: options
            });
            return $.Deferred(function(defer) {
                $.ajax({
                    type: "POST",
                    url: url,
                    data: payload,
                    contentType: jsonContentType
                }).done(function(data) {
                    if (data.success) {
                        defer.resolve()
                    } else {
                        defer.rejectWith(this, [data.msg])
                    }
                }).fail(function() {
                    defer.rejectWith(this, [gettext("This feedback could not be submitted.")])
                })
            }).promise()
        },
        peerAssess: function(optionsSelected, criterionFeedback, overallFeedback, uuid) {
            var url = this.url("peer_assess");
            var payload = JSON.stringify({
                options_selected: optionsSelected,
                criterion_feedback: criterionFeedback,
                overall_feedback: overallFeedback,
                submission_uuid: uuid
            });
            return $.Deferred(function(defer) {
                $.ajax({
                    type: "POST",
                    url: url,
                    data: payload,
                    contentType: jsonContentType
                }).done(function(data) {
                    if (data.success) {
                        defer.resolve()
                    } else {
                        defer.rejectWith(this, [data.msg])
                    }
                }).fail(function() {
                    defer.rejectWith(this, [gettext("This assessment could not be submitted.")])
                })
            }).promise()
        },
        selfAssess: function(optionsSelected, criterionFeedback, overallFeedback) {
            var url = this.url("self_assess");
            var payload = JSON.stringify({
                options_selected: optionsSelected,
                criterion_feedback: criterionFeedback,
                overall_feedback: overallFeedback
            });
            return $.Deferred(function(defer) {
                $.ajax({
                    type: "POST",
                    url: url,
                    data: payload,
                    contentType: jsonContentType
                }).done(function(data) {
                    if (data.success) {
                        defer.resolve()
                    } else {
                        defer.rejectWith(this, [data.msg])
                    }
                }).fail(function() {
                    defer.rejectWith(this, [gettext("This assessment could not be submitted.")])
                })
            })
        },
        trainingAssess: function(optionsSelected) {
            var url = this.url("training_assess");
            var payload = JSON.stringify({
                options_selected: optionsSelected
            });
            return $.Deferred(function(defer) {
                $.ajax({
                    type: "POST",
                    url: url,
                    data: payload,
                    contentType: jsonContentType
                }).done(function(data) {
                    if (data.success) {
                        defer.resolveWith(this, [data.corrections])
                    } else {
                        defer.rejectWith(this, [data.msg])
                    }
                }).fail(function() {
                    defer.rejectWith(this, [gettext("This assessment could not be submitted.")])
                })
            })
        },
        scheduleTraining: function() {
            var url = this.url("schedule_training");
            return $.Deferred(function(defer) {
                $.ajax({
                    type: "POST",
                    url: url,
                    data: '""',
                    contentType: jsonContentType
                }).done(function(data) {
                    if (data.success) {
                        defer.resolveWith(this, [data.msg])
                    } else {
                        defer.rejectWith(this, [data.msg])
                    }
                }).fail(function() {
                    defer.rejectWith(this, [gettext("This assessment could not be submitted.")])
                })
            })
        },
        rescheduleUnfinishedTasks: function() {
            var url = this.url("reschedule_unfinished_tasks");
            return $.Deferred(function(defer) {
                $.ajax({
                    type: "POST",
                    url: url,
                    data: '""',
                    contentType: jsonContentType
                }).done(function(data) {
                    if (data.success) {
                        defer.resolveWith(this, [data.msg])
                    } else {
                        defer.rejectWith(this, [data.msg])
                    }
                }).fail(function() {
                    defer.rejectWith(this, [gettext("One or more rescheduling tasks failed.")])
                })
            })
        },
        updateEditorContext: function(kwargs) {
            var url = this.url("update_editor_context");
            var payload = JSON.stringify({
                prompts: kwargs.prompts,
                feedback_prompt: kwargs.feedbackPrompt,
                feedback_default_text: kwargs.feedback_default_text,
                title: kwargs.title,
                submission_start: kwargs.submissionStart,
                submission_due: kwargs.submissionDue,
                criteria: kwargs.criteria,
                assessments: kwargs.assessments,
                editor_assessments_order: kwargs.editorAssessmentsOrder,
                file_upload_type: kwargs.fileUploadType,
                white_listed_file_types: kwargs.fileTypeWhiteList,
                allow_latex: kwargs.latexEnabled,
                leaderboard_show: kwargs.leaderboardNum
            });
            return $.Deferred(function(defer) {
                $.ajax({
                    type: "POST",
                    url: url,
                    data: payload,
                    contentType: jsonContentType
                }).done(function(data) {
                    if (data.success) {
                        defer.resolve()
                    } else {
                        defer.rejectWith(this, [data.msg])
                    }
                }).fail(function() {
                    defer.rejectWith(this, [gettext("This problem could not be saved.")])
                })
            }).promise()
        },
        checkReleased: function() {
            var url = this.url("check_released");
            var payload = '""';
            return $.Deferred(function(defer) {
                $.ajax({
                    type: "POST",
                    url: url,
                    data: payload,
                    contentType: jsonContentType
                }).done(function(data) {
                    if (data.success) {
                        defer.resolveWith(this, [data.is_released])
                    } else {
                        defer.rejectWith(this, [data.msg])
                    }
                }).fail(function() {
                    defer.rejectWith(this, [gettext("The server could not be contacted.")])
                })
            }).promise()
        },
        getUploadUrl: function(contentType, filename) {
            var url = this.url("upload_url");
            return $.Deferred(function(defer) {
                $.ajax({
                    type: "POST",
                    url: url,
                    data: JSON.stringify({
                        contentType: contentType,
                        filename: filename
                    }),
                    contentType: jsonContentType
                }).done(function(data) {
                    if (data.success) {
                        defer.resolve(data.url)
                    } else {
                        defer.rejectWith(this, [data.msg])
                    }
                }).fail(function() {
                    defer.rejectWith(this, [gettext("Could not retrieve upload url.")])
                })
            }).promise()
        },
        getDownloadUrl: function() {
            var url = this.url("download_url");
            return $.Deferred(function(defer) {
                $.ajax({
                    type: "POST",
                    url: url,
                    data: JSON.stringify({}),
                    contentType: jsonContentType
                }).done(function(data) {
                    if (data.success) {
                        defer.resolve(data.url)
                    } else {
                        defer.rejectWith(this, [data.msg])
                    }
                }).fail(function() {
                    defer.rejectWith(this, [gettext("Could not retrieve download url.")])
                })
            }).promise()
        },
        cancelSubmission: function(submissionUUID, comments) {
            var url = this.url("cancel_submission");
            var payload = JSON.stringify({
                submission_uuid: submissionUUID,
                comments: comments
            });
            return $.Deferred(function(defer) {
                $.ajax({
                    type: "POST",
                    url: url,
                    data: payload,
                    contentType: jsonContentType
                }).done(function(data) {
                    if (data.success) {
                        defer.resolveWith(this, [data.msg])
                    } else {
                        defer.rejectWith(this, [data.msg])
                    }
                }).fail(function() {
                    defer.rejectWith(this, [gettext("The submission could not be removed from the grading pool.")])
                })
            }).promise()
        }
    }
}
if (typeof OpenAssessment == "undefined" || !OpenAssessment) {
    OpenAssessment = {}
}
if (typeof window.gettext === "undefined") {
    window.gettext = function(text) {
        return text
    }
}
if (typeof window.ngetgext === "undefined") {
    window.ngettext = function(singular_text, plural_text, n) {
        if (n > 1) {
            return plural_text
        } else {
            return singular_text
        }
    }
}
if (typeof window.Logger === "undefined") {
    window.Logger = {
        log: function() {}
    }
}
if (typeof window.MathJax === "undefined") {
    window.MathJax = {
        Hub: {
            Typeset: function() {},
            Queue: function() {}
        }
    }
}
OpenAssessment.BaseView = function(runtime, element, server, data) {
    this.runtime = runtime;
    this.element = element;
    this.server = server;
    this.fileUploader = new OpenAssessment.FileUploader;
    this.responseView = new OpenAssessment.ResponseView(this.element, this.server, this.fileUploader, this, data);
    this.trainingView = new OpenAssessment.StudentTrainingView(this.element, this.server, this);
    this.selfView = new OpenAssessment.SelfView(this.element, this.server, this);
    this.peerView = new OpenAssessment.PeerView(this.element, this.server, this);
    this.gradeView = new OpenAssessment.GradeView(this.element, this.server, this);
    this.leaderboardView = new OpenAssessment.LeaderboardView(this.element, this.server, this);
    this.messageView = new OpenAssessment.MessageView(this.element, this.server, this);
    this.staffAreaView = new OpenAssessment.StaffAreaView(this.element, this.server, this)
};
OpenAssessment.BaseView.prototype = {
    scrollToTop: function() {
        if ($.scrollTo instanceof Function) {
            $(window).scrollTo($("#openassessment__steps", this.element), 800, {
                offset: -50
            })
        }
    },
    setUpCollapseExpand: function(parentSel) {
        parentSel.on("click", ".ui-toggle-visibility__control", function(eventData) {
            var sel = $(eventData.target).closest(".ui-toggle-visibility");
            sel.toggleClass("is--collapsed")
        })
    },
    load: function() {
        this.responseView.load();
        this.loadAssessmentModules();
        this.staffAreaView.load()
    },
    loadAssessmentModules: function() {
        this.trainingView.load();
        this.peerView.load();
        this.selfView.load();
        this.gradeView.load();
        this.leaderboardView.load()
    },
    loadMessageView: function() {
        this.messageView.load()
    },
    toggleActionError: function(type, msg) {
        var element = this.element;
        var container = null;
        if (type === "save") {
            container = ".response__submission__actions"
        } else if (type === "submit" || type === "peer" || type === "self" || type === "student-training") {
            container = ".step__actions"
        } else if (type === "feedback_assess") {
            container = ".submission__feedback__actions"
        } else if (type === "upload") {
            container = "#upload__error"
        }
        if (container === null) {
            if (msg !== null) {
                console.log(msg)
            }
        } else {
            var msgHtml = msg === null ? "" : msg;
            $(container + " .message__content", element).html("<p>" + msgHtml + "</p>");
            $(container, element).toggleClass("has--error", msg !== null)
        }
    },
    showLoadError: function(step) {
        var container = "#openassessment__" + step;
        $(container).toggleClass("has--error", true);
        $(container + " .step__status__value i").removeClass().addClass("ico icon-warning-sign");
        $(container + " .step__status__value .copy").html(gettext("Unable to Load"))
    }
};

function OpenAssessmentBlock(runtime, element, data) {
    var server = new OpenAssessment.Server(runtime, element);
    var view = new OpenAssessment.BaseView(runtime, element, server, data);
    view.load()
}
OpenAssessment.FileUploader = function() {
    this.upload = function(url, file) {
        return $.Deferred(function(defer) {
            $.ajax({
                url: url,
                type: "PUT",
                data: file,
                async: false,
                processData: false,
                contentType: file.type
            }).done(function() {
                Logger.log("openassessment.upload_file", {
                    fileName: file.name,
                    fileSize: file.size,
                    fileType: file.type
                });
                defer.resolve()
            }).fail(function(data, textStatus) {
                defer.rejectWith(this, [textStatus])
            })
        }).promise()
    }
};
OpenAssessment.GradeView = function(element, server, baseView) {
    this.element = element;
    this.server = server;
    this.baseView = baseView
};
OpenAssessment.GradeView.prototype = {
    load: function() {
        var view = this;
        var baseView = this.baseView;
        this.server.render("grade").done(function(html) {
            $("#openassessment__grade", view.element).replaceWith(html);
            view.server.renderLatex($("#openassessment__grade", view.element));
            view.installHandlers()
        }).fail(function(errMsg) {
            baseView.showLoadError("grade", errMsg)
        })
    },
    installHandlers: function() {
        var sel = $("#openassessment__grade", this.element);
        this.baseView.setUpCollapseExpand(sel);
        var view = this;
        sel.find("#feedback__submit").click(function(eventObject) {
            eventObject.preventDefault();
            view.submitFeedbackOnAssessment()
        })
    },
    feedbackText: function(text) {
        if (typeof text === "undefined") {
            return $("#feedback__remarks__value", this.element).val()
        } else {
            $("#feedback__remarks__value", this.element).val(text)
        }
    },
    feedbackOptions: function(options) {
        var view = this;
        if (typeof options === "undefined") {
            return $.map($(".feedback__overall__value:checked", view.element), function(element) {
                return $(element).val()
            })
        } else {
            $(".feedback__overall__value", this.element).prop("checked", false);
            $.each(options, function(index, opt) {
                $("#feedback__overall__value--" + opt, view.element).prop("checked", true)
            })
        }
    },
    setHidden: function(sel, hidden) {
        sel.toggleClass("is--hidden", hidden);
        sel.attr("aria-hidden", hidden ? "true" : "false")
    },
    isHidden: function(sel) {
        return sel.hasClass("is--hidden") && sel.attr("aria-hidden") === "true"
    },
    feedbackState: function(newState) {
        var containerSel = $(".submission__feedback__content", this.element);
        var instructionsSel = containerSel.find(".submission__feedback__instructions");
        var fieldsSel = containerSel.find(".submission__feedback__fields");
        var actionsSel = containerSel.find(".submission__feedback__actions");
        var transitionSel = containerSel.find(".transition__status");
        var messageSel = containerSel.find(".message--complete");
        if (typeof newState === "undefined") {
            var isSubmitting = containerSel.hasClass("is--transitioning") && containerSel.hasClass("is--submitting") && !this.isHidden(transitionSel) && this.isHidden(messageSel) && this.isHidden(instructionsSel) && this.isHidden(fieldsSel) && this.isHidden(actionsSel);
            var hasSubmitted = containerSel.hasClass("is--submitted") && this.isHidden(transitionSel) && !this.isHidden(messageSel) && this.isHidden(instructionsSel) && this.isHidden(fieldsSel) && this.isHidden(actionsSel);
            var isOpen = !containerSel.hasClass("is--submitted") && !containerSel.hasClass("is--transitioning") && !containerSel.hasClass("is--submitting") && this.isHidden(transitionSel) && this.isHidden(messageSel) && !this.isHidden(instructionsSel) && !this.isHidden(fieldsSel) && !this.isHidden(actionsSel);
            if (isOpen) {
                return "open"
            } else if (isSubmitting) {
                return "submitting"
            } else if (hasSubmitted) {
                return "submitted"
            } else {
                throw "Invalid feedback state"
            }
        } else {
            if (newState === "open") {
                containerSel.toggleClass("is--transitioning", false);
                containerSel.toggleClass("is--submitting", false);
                containerSel.toggleClass("is--submitted", false);
                this.setHidden(instructionsSel, false);
                this.setHidden(fieldsSel, false);
                this.setHidden(actionsSel, false);
                this.setHidden(transitionSel, true);
                this.setHidden(messageSel, true)
            } else if (newState === "submitting") {
                containerSel.toggleClass("is--transitioning", true);
                containerSel.toggleClass("is--submitting", true);
                containerSel.toggleClass("is--submitted", false);
                this.setHidden(instructionsSel, true);
                this.setHidden(fieldsSel, true);
                this.setHidden(actionsSel, true);
                this.setHidden(transitionSel, false);
                this.setHidden(messageSel, true)
            } else if (newState === "submitted") {
                containerSel.toggleClass("is--transitioning", false);
                containerSel.toggleClass("is--submitting", false);
                containerSel.toggleClass("is--submitted", true);
                this.setHidden(instructionsSel, true);
                this.setHidden(fieldsSel, true);
                this.setHidden(actionsSel, true);
                this.setHidden(transitionSel, true);
                this.setHidden(messageSel, false)
            }
        }
    },
    submitFeedbackOnAssessment: function() {
        var view = this;
        var baseView = this.baseView;
        $("#feedback__submit", this.element).toggleClass("is--disabled", true);
        view.feedbackState("submitting");
        this.server.submitFeedbackOnAssessment(this.feedbackText(), this.feedbackOptions()).done(function() {
            view.feedbackState("submitted")
        }).fail(function(errMsg) {
            baseView.toggleActionError("feedback_assess", errMsg)
        })
    }
};
OpenAssessment.LeaderboardView = function(element, server, baseView) {
    this.element = element;
    this.server = server;
    this.baseView = baseView
};
OpenAssessment.LeaderboardView.prototype = {
    load: function() {
        var view = this;
        var baseView = this.baseView;
        this.server.render("leaderboard").done(function(html) {
            $("#openassessment__leaderboard", view.element).replaceWith(html);
            view.server.renderLatex($("#openassessment__leaderboard", view.element))
        }).fail(function(errMsg) {
            baseView.showLoadError("leaderboard", errMsg)
        })
    }
};
OpenAssessment.MessageView = function(element, server, baseView) {
    this.element = element;
    this.server = server;
    this.baseView = baseView
};
OpenAssessment.MessageView.prototype = {
    load: function() {
        var view = this;
        var baseView = this.baseView;
        this.server.render("message").done(function(html) {
            $("#openassessment__message", view.element).replaceWith(html);
            view.server.renderLatex($("#openassessment__message", view.element))
        }).fail(function(errMsg) {
            baseView.showLoadError("message", errMsg)
        })
    }
};
OpenAssessment.PeerView = function(element, server, baseView) {
    this.element = element;
    this.server = server;
    this.baseView = baseView;
    this.rubric = null
};
OpenAssessment.PeerView.prototype = {
    load: function() {
        var view = this;
        this.server.render("peer_assessment").done(function(html) {
            $("#openassessment__peer-assessment", view.element).replaceWith(html);
            view.server.renderLatex($("#openassessment__peer-assessment", view.element));
            view.installHandlers(false)
        }).fail(function() {
            view.baseView.showLoadError("peer-assessment")
        });
        view.baseView.loadMessageView()
    },
    loadContinuedAssessment: function() {
        var view = this;
        view.continueAssessmentEnabled(false);
        this.server.renderContinuedPeer().done(function(html) {
            $("#openassessment__peer-assessment", view.element).replaceWith(html);
            view.server.renderLatex($("#openassessment__peer-assessment", view.element));
            view.installHandlers(true)
        }).fail(function() {
            view.baseView.showLoadError("peer-assessment");
            view.continueAssessmentEnabled(true)
        })
    },
    continueAssessmentEnabled: function(enabled) {
        var button = $("#peer-assessment__continue__grading", this.element);
        if (typeof enabled === "undefined") {
            return !button.hasClass("is--disabled")
        } else {
            button.toggleClass("is--disabled", !enabled)
        }
    },
    installHandlers: function(isContinuedAssessment) {
        var sel = $("#openassessment__peer-assessment", this.element);
        var view = this;
        this.baseView.setUpCollapseExpand(sel);
        var rubricSelector = $("#peer-assessment--001__assessment", this.element);
        if (rubricSelector.size() > 0) {
            var rubricElement = rubricSelector.get(0);
            this.rubric = new OpenAssessment.Rubric(rubricElement)
        }
        if (this.rubric !== null) {
            this.rubric.canSubmitCallback($.proxy(view.peerSubmitEnabled, view))
        }
        sel.find("#peer-assessment--001__assessment__submit").click(function(eventObject) {
            eventObject.preventDefault();
            if (!isContinuedAssessment) {
                view.peerAssess()
            } else {
                view.continuedPeerAssess()
            }
        });
        sel.find("#peer-assessment__continue__grading").click(function(eventObject) {
            eventObject.preventDefault();
            view.loadContinuedAssessment()
        })
    },
    peerSubmitEnabled: function(enabled) {
        var button = $("#peer-assessment--001__assessment__submit", this.element);
        if (typeof enabled === "undefined") {
            return !button.hasClass("is--disabled")
        } else {
            button.toggleClass("is--disabled", !enabled)
        }
    },
    peerAssess: function() {
        var view = this;
        var baseView = view.baseView;
        this.peerAssessRequest(function() {
            baseView.loadAssessmentModules();
            baseView.scrollToTop()
        })
    },
    continuedPeerAssess: function() {
        var view = this;
        var gradeView = this.baseView.gradeView;
        var baseView = view.baseView;
        view.peerAssessRequest(function() {
            view.loadContinuedAssessment();
            gradeView.load();
            baseView.scrollToTop()
        })
    },
    peerAssessRequest: function(successFunction) {
        var view = this;
        var uuid = $("#openassessment__peer-assessment").data("submission-uuid");
        view.baseView.toggleActionError("peer", null);
        view.peerSubmitEnabled(false);
        this.server.peerAssess(this.rubric.optionsSelected(), this.rubric.criterionFeedback(), this.rubric.overallFeedback(), uuid).done(successFunction).fail(function(errMsg) {
            view.baseView.toggleActionError("peer", errMsg);
            view.peerSubmitEnabled(true)
        })
    }
};
OpenAssessment.ResponseView = function(element, server, fileUploader, baseView, data) {
    this.element = element;
    this.server = server;
    this.fileUploader = fileUploader;
    this.baseView = baseView;
    this.savedResponse = [];
    this.files = null;
    this.fileType = null;
    this.lastChangeTime = Date.now();
    this.errorOnLastSave = false;
    this.autoSaveTimerId = null;
    this.data = data;
    this.fileUploaded = false
};
OpenAssessment.ResponseView.prototype = {
    AUTO_SAVE_POLL_INTERVAL: 2e3,
    AUTO_SAVE_WAIT: 3e4,
    MAX_FILE_SIZE: 5242880,
    load: function() {
        var view = this;
        this.server.render("submission").done(function(html) {
            $("#openassessment__response", view.element).replaceWith(html);
            view.server.renderLatex($("#openassessment__response", view.element));
            view.installHandlers();
            view.setAutoSaveEnabled(true)
        }).fail(function() {
            view.baseView.showLoadError("response")
        })
    },
    installHandlers: function() {
        var sel = $("#openassessment__response", this.element);
        var view = this;
        var uploadType = "";
        if (sel.find(".submission__answer__display__file").length) {
            uploadType = sel.find(".submission__answer__display__file").data("upload-type")
        }
        this.baseView.setUpCollapseExpand(sel);
        this.savedResponse = this.response();
        var handleChange = function() {
            view.handleResponseChanged()
        };
        sel.find(".submission__answer__part__text__value").on("change keyup drop paste", handleChange);
        var handlePrepareUpload = function(eventData) {
            view.prepareUpload(eventData.target.files, uploadType)
        };
        sel.find("input[type=file]").on("change", handlePrepareUpload);
        sel.find("#submission__preview__item").hide();
        sel.find("#step--response__submit").click(function(eventObject) {
            eventObject.preventDefault();
            view.submit()
        });
        sel.find("#submission__save").click(function(eventObject) {
            eventObject.preventDefault();
            view.save()
        });
        sel.find("#submission__preview").click(function(eventObject) {
            eventObject.preventDefault();
            var preview_text = sel.find(".submission__answer__part__text__value").val();
            var preview_container = sel.find("#preview_content");
            preview_container.html(preview_text.replace(/\r\n|\r|\n/g, "<br />"));
            sel.find("#submission__preview__item").show();
            MathJax.Hub.Queue(["Typeset", MathJax.Hub, preview_container[0]])
        });
        sel.find("#file__upload").click(function(eventObject) {
            eventObject.preventDefault();
            $(".submission__answer__display__file", view.element).removeClass("is--hidden");
            view.fileUpload()
        })
    },
    setAutoSaveEnabled: function(enabled) {
        if (enabled) {
            if (this.autoSaveTimerId === null) {
                this.autoSaveTimerId = setInterval($.proxy(this.autoSave, this), this.AUTO_SAVE_POLL_INTERVAL)
            }
        } else {
            if (this.autoSaveTimerId !== null) {
                clearInterval(this.autoSaveTimerId)
            }
        }
    },
    submitEnabled: function(enabled) {
        var sel = $("#step--response__submit", this.element);
        if (typeof enabled === "undefined") {
            return !sel.hasClass("is--disabled")
        } else {
            sel.toggleClass("is--disabled", !enabled)
        }
    },
    saveEnabled: function(enabled) {
        var sel = $("#submission__save", this.element);
        if (typeof enabled === "undefined") {
            return !sel.hasClass("is--disabled")
        } else {
            sel.toggleClass("is--disabled", !enabled)
        }
    },
    previewEnabled: function(enabled) {
        var sel = $("#submission__preview", this.element);
        if (typeof enabled === "undefined") {
            return !sel.hasClass("is--disabled")
        } else {
            sel.toggleClass("is--disabled", !enabled)
        }
    },
    saveStatus: function(msg) {
        var sel = $("#response__save_status h3", this.element);
        if (typeof msg === "undefined") {
            return sel.text()
        } else {
            var label = gettext("Status of Your Response");
            sel.html('<span class="sr">' + label + ":" + "</span>\n" + msg)
        }
    },
    unsavedWarningEnabled: function(enabled) {
        if (typeof enabled === "undefined") {
            return window.onbeforeunload !== null
        } else {
            if (enabled) {
                window.onbeforeunload = function() {
                    return gettext("If you leave this page without saving or submitting your response, you'll lose any work you've done on the response.")
                }
            } else {
                window.onbeforeunload = null
            }
        }
    },
    response: function(texts) {
        var sel = $(".submission__answer__part__text__value", this.element);
        if (typeof texts === "undefined") {
            return sel.map(function() {
                return $.trim($(this).val())
            }).get()
        } else {
            sel.map(function(index) {
                $(this).val(texts[index])
            })
        }
    },
    responseChanged: function() {
        var savedResponse = this.savedResponse;
        return this.response().some(function(element, index) {
            return element !== savedResponse[index]
        })
    },
    autoSave: function() {
        var timeSinceLastChange = Date.now() - this.lastChangeTime;
        if (this.responseChanged() && timeSinceLastChange > this.AUTO_SAVE_WAIT && !this.errorOnLastSave) {
            this.save()
        }
    },
    handleResponseChanged: function() {
        var isNotBlank = !this.response().every(function(element) {
            return $.trim(element) === ""
        });
        this.submitEnabled(isNotBlank);
        if (this.responseChanged()) {
            this.saveEnabled(isNotBlank);
            this.previewEnabled(isNotBlank);
            this.saveStatus(gettext("This response has not been saved."));
            this.unsavedWarningEnabled(true)
        }
        this.lastChangeTime = Date.now()
    },
    save: function() {
        this.errorOnLastSave = false;
        this.saveStatus(gettext("Saving..."));
        this.baseView.toggleActionError("save", null);
        this.unsavedWarningEnabled(false);
        var view = this;
        var savedResponse = this.response();
        this.server.save(savedResponse).done(function() {
            view.savedResponse = savedResponse;
            var currentResponse = view.response();
            var currentResponseIsEmpty = currentResponse.every(function(element) {
                return element === ""
            });
            view.submitEnabled(!currentResponseIsEmpty);
            var currentResponseEqualsSaved = currentResponse.every(function(element, index) {
                return element === savedResponse[index]
            });
            if (currentResponseEqualsSaved) {
                view.saveEnabled(false);
                view.saveStatus(gettext("This response has been saved but not submitted."))
            }
        }).fail(function(errMsg) {
            view.saveStatus(gettext("Error"));
            view.baseView.toggleActionError("save", errMsg);
            view.errorOnLastSave = true
        })
    },
    submit: function() {
        this.submitEnabled(false);
        var view = this;
        var baseView = this.baseView;
        var fileDefer = $.Deferred();
        if (view.files !== null && !view.fileUploaded) {
            var msg = gettext("Do you want to upload your file before submitting?");
            if (confirm(msg)) {
                fileDefer = view.fileUpload()
            } else {
                view.submitEnabled(true);
                return
            }
        } else {
            fileDefer.resolve()
        }
        fileDefer.pipe(function() {
            return view.confirmSubmission().pipe(function() {
                var submission = view.response();
                baseView.toggleActionError("response", null);
                return view.server.submit(submission)
            })
        }).done($.proxy(view.moveToNextStep, view)).fail(function(errCode, errMsg) {
            if (errCode === "ENOMULTI") {
                view.moveToNextStep()
            } else {
                if (errMsg) {
                    baseView.toggleActionError("submit", errMsg)
                }
                view.submitEnabled(true)
            }
        })
    },
    moveToNextStep: function() {
        this.load();
        this.baseView.loadAssessmentModules();
        this.unsavedWarningEnabled(false)
    },
    confirmSubmission: function() {
        var msg = gettext("You're about to submit your response for this assignment. After you submit this response, you can't change it or submit a new response.");
        return $.Deferred(function(defer) {
            if (confirm(msg)) {
                defer.resolve()
            } else {
                defer.reject()
            }
        })
    },
    prepareUpload: function(files, uploadType) {
        this.files = null;
        this.fileType = files[0].type;
        var ext = files[0].name.split(".").pop().toLowerCase();
        if (files[0].size > this.MAX_FILE_SIZE) {
            this.baseView.toggleActionError("upload", gettext("File size must be 5MB or less."))
        } else if (uploadType === "image" && this.data.ALLOWED_IMAGE_MIME_TYPES.indexOf(this.fileType) === -1) {
            this.baseView.toggleActionError("upload", gettext("You can upload files with these file types: ") + "JPG, PNG or GIF")
        } else if (uploadType === "pdf-and-image" && this.data.ALLOWED_FILE_MIME_TYPES.indexOf(this.fileType) === -1) {
            this.baseView.toggleActionError("upload", gettext("You can upload files with these file types: ") + "JPG, PNG, GIF or PDF")
        } else if (uploadType === "custom" && this.data.FILE_TYPE_WHITE_LIST.indexOf(ext) === -1) {
            this.baseView.toggleActionError("upload", gettext("You can upload files with these file types: ") + this.data.FILE_TYPE_WHITE_LIST.join(", "))
        } else if (this.data.FILE_EXT_BLACK_LIST.indexOf(ext) !== -1) {
            this.baseView.toggleActionError("upload", gettext("File type is not allowed."))
        } else {
            this.baseView.toggleActionError("upload", null);
            this.files = files
        }
        $("#file__upload").toggleClass("is--disabled", this.files === null)
    },
    fileUpload: function() {
        var view = this;
        var fileUpload = $("#file__upload");
        fileUpload.addClass("is--disabled");
        var handleError = function(errMsg) {
            view.baseView.toggleActionError("upload", errMsg);
            fileUpload.removeClass("is--disabled")
        };
        return this.server.getUploadUrl(view.fileType, view.files[0].name).done(function(url) {
            var file = view.files[0];
            view.fileUploader.upload(url, file).done(function() {
                view.fileUrl();
                view.baseView.toggleActionError("upload", null);
                view.fileUploaded = true
            }).fail(handleError)
        }).fail(handleError)
    },
    fileUrl: function() {
        var view = this;
        var file = $("#submission__answer__file", view.element);
        view.server.getDownloadUrl().done(function(url) {
            if (file.prop("tagName") === "IMG") {
                file.attr("src", url)
            } else {
                file.attr("href", url)
            }
            return url
        })
    }
};
OpenAssessment.Rubric = function(element) {
    this.element = element
};
OpenAssessment.Rubric.prototype = {
    criterionFeedback: function(criterionFeedback) {
        var selector = "textarea.answer__value";
        var feedback = {};
        $(selector, this.element).each(function(index, sel) {
            if (typeof criterionFeedback !== "undefined") {
                $(sel).val(criterionFeedback[sel.name]);
                feedback[sel.name] = criterionFeedback[sel.name]
            } else {
                feedback[sel.name] = $(sel).val()
            }
        });
        return feedback
    },
    overallFeedback: function(overallFeedback) {
        var selector = "#assessment__rubric__question--feedback__value";
        if (typeof overallFeedback === "undefined") {
            return $(selector, this.element).val()
        } else {
            $(selector, this.element).val(overallFeedback)
        }
    },
    optionsSelected: function(optionsSelected) {
        var selector = "input[type=radio]";
        if (typeof optionsSelected === "undefined") {
            var options = {};
            $(selector + ":checked", this.element).each(function(index, sel) {
                options[sel.name] = sel.value
            });
            return options
        } else {
            $(selector, this.element).prop("checked", false);
            $(selector, this.element).each(function(index, sel) {
                if (optionsSelected.hasOwnProperty(sel.name)) {
                    if (sel.value === optionsSelected[sel.name]) {
                        $(sel).prop("checked", true)
                    }
                }
            })
        }
    },
    canSubmitCallback: function(callback) {
        var rubric = this;
        callback(rubric.canSubmit());
        $(this.element).on("change keyup drop paste", function() {
            callback(rubric.canSubmit())
        })
    },
    canSubmit: function() {
        var numChecked = $("input[type=radio]:checked", this.element).length;
        var numAvailable = $(".field--radio.assessment__rubric__question.has--options", this.element).length;
        var completedRequiredComments = true;
        $("textarea[required]", this.element).each(function() {
            var trimmedText = $.trim($(this).val());
            if (trimmedText === "") {
                completedRequiredComments = false
            }
        });
        return numChecked === numAvailable && completedRequiredComments
    },
    showCorrections: function(corrections) {
        var selector = "input[type=radio]";
        var hasErrors = false;
        $(selector, this.element).each(function(index, sel) {
            var listItem = $(sel).parents(".assessment__rubric__question");
            if (corrections.hasOwnProperty(sel.name)) {
                hasErrors = true;
                listItem.find(".message--incorrect").removeClass("is--hidden");
                listItem.find(".message--correct").addClass("is--hidden")
            } else {
                listItem.find(".message--correct").removeClass("is--hidden");
                listItem.find(".message--incorrect").addClass("is--hidden")
            }
        });
        return hasErrors
    }
};
OpenAssessment.SelfView = function(element, server, baseView) {
    this.element = element;
    this.server = server;
    this.baseView = baseView;
    this.rubric = null
};
OpenAssessment.SelfView.prototype = {
    load: function() {
        var view = this;
        this.server.render("self_assessment").done(function(html) {
            $("#openassessment__self-assessment", view.element).replaceWith(html);
            view.server.renderLatex($("#openassessment__self-assessment", view.element));
            view.installHandlers()
        }).fail(function() {
            view.showLoadError("self-assessment")
        })
    },
    installHandlers: function() {
        var view = this;
        var sel = $("#openassessment__self-assessment", view.element);
        this.baseView.setUpCollapseExpand(sel);
        var rubricSelector = $("#self-assessment--001__assessment", this.element);
        if (rubricSelector.size() > 0) {
            var rubricElement = rubricSelector.get(0);
            this.rubric = new OpenAssessment.Rubric(rubricElement)
        }
        if (this.rubric !== null) {
            this.rubric.canSubmitCallback($.proxy(this.selfSubmitEnabled, this))
        }
        sel.find("#self-assessment--001__assessment__submit").click(function(eventObject) {
            eventObject.preventDefault();
            view.selfAssess()
        })
    },
    selfSubmitEnabled: function(enabled) {
        var button = $("#self-assessment--001__assessment__submit", this.element);
        if (typeof enabled === "undefined") {
            return !button.hasClass("is--disabled")
        } else {
            button.toggleClass("is--disabled", !enabled)
        }
    },
    selfAssess: function() {
        var view = this;
        var baseView = this.baseView;
        baseView.toggleActionError("self", null);
        view.selfSubmitEnabled(false);
        this.server.selfAssess(this.rubric.optionsSelected(), this.rubric.criterionFeedback(), this.rubric.overallFeedback()).done(function() {
            baseView.loadAssessmentModules();
            baseView.scrollToTop()
        }).fail(function(errMsg) {
            baseView.toggleActionError("self", errMsg);
            view.selfSubmitEnabled(true)
        })
    }
};
! function(OpenAssessment) {
    "use strict";
    OpenAssessment.StaffAreaView = function(element, server, baseView) {
        this.element = element;
        this.server = server;
        this.baseView = baseView
    };
    OpenAssessment.StaffAreaView.prototype = {
        load: function() {
            var view = this;
            if ($("#openassessment__staff-area", view.element).length > 0) {
                this.server.render("staff_area").done(function(html) {
                    $("#openassessment__staff-area", view.element).replaceWith(html);
                    view.server.renderLatex($("#openassessment__staff-area", view.element));
                    view.installHandlers()
                }).fail(function() {
                    view.baseView.showLoadError("staff_area")
                })
            }
        },
        loadStudentInfo: function() {
            var view = this;
            var sel = $("#openassessment__staff-tools", this.element);
            var student_username = sel.find("#openassessment__student_username").val();
            this.server.studentInfo(student_username).done(function(html) {
                $("#openassessment__student-info", view.element).replaceWith(html);
                var selCancelSub = $("#openassessment__staff-info__cancel__submission", view.element);
                selCancelSub.on("click", "#submit_cancel_submission", function(eventObject) {
                    eventObject.preventDefault();
                    view.cancelSubmission($(this).data("submission-uuid"))
                });
                var handleChange = function(eventData) {
                    view.handleCommentChanged(eventData)
                };
                selCancelSub.find("#staff-info__cancel-submission__comments").on("change keyup drop paste", handleChange)
            }).fail(function() {
                view.showLoadError("student_info")
            })
        },
        installHandlers: function() {
            var $staffArea = $("#openassessment__staff-area", this.element);
            var toolsElement = $("#openassessment__staff-tools", $staffArea);
            var infoElement = $("#openassessment__student-info", $staffArea);
            var view = this;
            if (toolsElement.length <= 0) {
                return
            }
            this.baseView.setUpCollapseExpand(toolsElement, function() {});
            this.baseView.setUpCollapseExpand(infoElement, function() {});
            $staffArea.find(".ui-staff__button").click(function(eventObject) {
                var $button = $(eventObject.currentTarget),
                    panelID = $button.data("panel"),
                    $panel = $staffArea.find("#" + panelID).first();
                if ($button.hasClass("is--active")) {
                    $button.removeClass("is--active");
                    $panel.addClass("is--hidden")
                } else {
                    $staffArea.find(".ui-staff__button").removeClass("is--active");
                    $button.addClass("is--active");
                    $staffArea.find(".wrapper--ui-staff").addClass("is--hidden");
                    $panel.removeClass("is--hidden")
                }
            });
            $staffArea.find(".ui-staff_close_button").click(function(eventObject) {
                var $button = $(eventObject.currentTarget),
                    $panel = $button.closest(".wrapper--ui-staff");
                $staffArea.find(".ui-staff__button").removeClass("is--active");
                $panel.addClass("is--hidden")
            });
            toolsElement.find("#openassessment_student_info_form").submit(function(eventObject) {
                eventObject.preventDefault();
                view.loadStudentInfo()
            });
            toolsElement.find("#submit_student_username").click(function(eventObject) {
                eventObject.preventDefault();
                view.loadStudentInfo()
            });
            toolsElement.find("#schedule_training").click(function(eventObject) {
                eventObject.preventDefault();
                view.scheduleTraining()
            });
            toolsElement.find("#reschedule_unfinished_tasks").click(function(eventObject) {
                eventObject.preventDefault();
                view.rescheduleUnfinishedTasks()
            })
        },
        scheduleTraining: function() {
            var view = this;
            this.server.scheduleTraining().done(function(msg) {
                $("#schedule_training_message", view.element).text(msg)
            }).fail(function(errMsg) {
                $("#schedule_training_message", view.element).text(errMsg)
            })
        },
        rescheduleUnfinishedTasks: function() {
            var view = this;
            this.server.rescheduleUnfinishedTasks().done(function(msg) {
                $("#reschedule_unfinished_tasks_message", view.element).text(msg)
            }).fail(function(errMsg) {
                $("#reschedule_unfinished_tasks_message", view.element).text(errMsg)
            })
        },
        cancelSubmission: function(submissionUUID) {
            this.cancelSubmissionEnabled(false);
            var view = this;
            var sel = $("#openassessment__student-info", this.element);
            var comments = sel.find("#staff-info__cancel-submission__comments").val();
            this.server.cancelSubmission(submissionUUID, comments).done(function(msg) {
                $(".cancel-submission-error").html("");
                $("#openassessment__staff-info__cancel__submission", view.element).html(msg)
            }).fail(function(errMsg) {
                $(".cancel-submission-error").html(errMsg)
            })
        },
        cancelSubmissionEnabled: function(enabled) {
            var sel = $("#submit_cancel_submission", this.element);
            if (typeof enabled === "undefined") {
                return !sel.hasClass("is--disabled")
            } else {
                sel.toggleClass("is--disabled", !enabled)
            }
        },
        comment: function(text) {
            var sel = $("#staff-info__cancel-submission__comments", this.element);
            if (typeof text === "undefined") {
                return sel.val()
            } else {
                sel.val(text)
            }
        },
        handleCommentChanged: function() {
            var isBlank = $.trim(this.comment()) !== "";
            this.cancelSubmissionEnabled(isBlank)
        }
    }
}(OpenAssessment);
OpenAssessment.StudentTrainingView = function(element, server, baseView) {
    this.element = element;
    this.server = server;
    this.baseView = baseView;
    this.rubric = null
};
OpenAssessment.StudentTrainingView.prototype = {
    load: function() {
        var view = this;
        this.server.render("student_training").done(function(html) {
            $("#openassessment__student-training", view.element).replaceWith(html);
            view.server.renderLatex($("#openassessment__student-training", view.element));
            view.installHandlers()
        }).fail(function() {
            view.baseView.showLoadError("student-training")
        })
    },
    installHandlers: function() {
        var sel = $("#openassessment__student-training", this.element);
        var view = this;
        this.baseView.setUpCollapseExpand(sel);
        var rubricSelector = $("#student-training--001__assessment", this.element);
        if (rubricSelector.size() > 0) {
            var rubricElement = rubricSelector.get(0);
            this.rubric = new OpenAssessment.Rubric(rubricElement)
        }
        if (this.rubric !== null) {
            this.rubric.canSubmitCallback($.proxy(this.assessButtonEnabled, this))
        }
        sel.find("#student-training--001__assessment__submit").click(function(eventObject) {
            eventObject.preventDefault();
            view.assess()
        })
    },
    assess: function() {
        this.assessButtonEnabled(false);
        var options = {};
        if (this.rubric !== null) {
            options = this.rubric.optionsSelected()
        }
        var view = this;
        var baseView = this.baseView;
        this.server.trainingAssess(options).done(function(corrections) {
            var incorrect = $("#openassessment__student-training--incorrect", view.element);
            var instructions = $("#openassessment__student-training--instructions", view.element);
            if (!view.rubric.showCorrections(corrections)) {
                view.load();
                baseView.loadAssessmentModules();
                incorrect.addClass("is--hidden");
                instructions.removeClass("is--hidden")
            } else {
                instructions.addClass("is--hidden");
                incorrect.removeClass("is--hidden")
            }
            baseView.scrollToTop()
        }).fail(function(errMsg) {
            baseView.toggleActionError("student-training", errMsg);
            view.assessButtonEnabled(true)
        })
    },
    assessButtonEnabled: function(isEnabled) {
        var button = $("#student-training--001__assessment__submit", this.element);
        if (typeof isEnabled === "undefined") {
            return !button.hasClass("is--disabled")
        } else {
            button.toggleClass("is--disabled", !isEnabled)
        }
    }
};