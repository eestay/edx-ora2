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
OpenAssessment.Container = function(ContainerItem, kwargs) {
    this.containerElement = kwargs.containerElement;
    this.templateElement = kwargs.templateElement;
    this.addButtonElement = kwargs.addButtonElement;
    this.removeButtonClass = kwargs.removeButtonClass;
    this.containerItemClass = kwargs.containerItemClass;
    this.notifier = kwargs.notifier;
    this.addRemoveEnabled = typeof kwargs.addRemoveEnabled === "undefined" || kwargs.addRemoveEnabled;
    var container = this;
    this.createContainerItem = function(element) {
        return new ContainerItem(element, container.notifier)
    }
};
OpenAssessment.Container.prototype = {
    addEventListeners: function() {
        var container = this;
        if (this.addRemoveEnabled) {
            $(this.addButtonElement).click($.proxy(this.add, this));
            $("." + this.removeButtonClass, this.containerElement).click(function(eventData) {
                var item = container.createContainerItem(eventData.target);
                container.remove(item)
            })
        } else {
            $(this.addButtonElement).addClass("is--disabled");
            $("." + this.removeButtonClass, this.containerElement).addClass("is--disabled")
        }
        $("." + this.containerItemClass, this.containerElement).each(function(index, element) {
            var item = container.createContainerItem(element);
            item.addEventListeners()
        })
    },
    add: function() {
        $(this.templateElement).children().first().clone().removeAttr("id").toggleClass("is--hidden", false).toggleClass(this.containerItemClass, true).appendTo($(this.containerElement));
        var container = this;
        var containerItem = $("." + this.containerItemClass, this.containerElement).last();
        if (this.addRemoveEnabled) {
            containerItem.find("." + this.removeButtonClass).click(function(eventData) {
                var containerItem = container.createContainerItem(eventData.target);
                container.remove(containerItem)
            })
        } else {
            containerItem.find("." + this.removeButtonClass).addClass("is--disabled")
        }
        var handlerItem = container.createContainerItem(containerItem);
        handlerItem.addEventListeners();
        handlerItem.addHandler()
    },
    remove: function(item) {
        var itemElement = $(item.element).closest("." + this.containerItemClass);
        var containerItem = this.createContainerItem(itemElement);
        containerItem.removeHandler();
        itemElement.remove()
    },
    getItemValues: function() {
        var values = [];
        var container = this;
        $("." + this.containerItemClass, this.containerElement).each(function(index, element) {
            var containerItem = container.createContainerItem(element);
            var fieldValues = containerItem.getFieldValues();
            values.push(fieldValues)
        });
        return values
    },
    getItem: function(index) {
        var element = $("." + this.containerItemClass, this.containerElement).get(index);
        return element !== undefined ? this.createContainerItem(element) : null
    },
    getAllItems: function() {
        var container = this;
        return $("." + this.containerItemClass, this.containerElement).map(function() {
            return container.createContainerItem(this)
        })
    }
};
OpenAssessment.ItemUtilities = {
    createUniqueName: function(selector, nameAttribute) {
        var index = 0;
        while (index <= selector.length) {
            if (selector.parent().find("*[" + nameAttribute + "='" + index + "']").length === 0) {
                return index.toString()
            }
            index++
        }
        return index.toString()
    },
    refreshOptionString: function(element) {
        var points = $(element).attr("data-points");
        var label = $(element).attr("data-label");
        var name = $(element).val();
        if (label === "") {
            label = gettext("Unnamed Option")
        }
        var singularString = label + " - " + points + " point";
        var multipleString = label + " - " + points + " points";
        var finalLabel = "";
        if (name === "") {
            finalLabel = gettext("Not Selected")
        } else if (isNaN(points)) {
            finalLabel = label
        } else {
            finalLabel = ngettext(singularString, multipleString, points)
        }
        $(element).text(finalLabel)
    }
};
OpenAssessment.Prompt = function(element, notifier) {
    this.element = element;
    this.notifier = notifier
};
OpenAssessment.Prompt.prototype = {
    getFieldValues: function() {
        var fields = {
            description: this.description()
        };
        return fields
    },
    description: function(text) {
        var sel = $(".openassessment_prompt_description", this.element);
        return OpenAssessment.Fields.stringField(sel, text)
    },
    addEventListeners: function() {},
    addHandler: function() {
        this.notifier.notificationFired("promptAdd", {
            index: this.element.index()
        })
    },
    removeHandler: function() {
        this.notifier.notificationFired("promptRemove", {
            index: this.element.index()
        })
    },
    updateHandler: function() {},
    validate: function() {
        return true
    },
    validationErrors: function() {
        return []
    },
    clearValidationErrors: function() {}
};
OpenAssessment.RubricOption = function(element, notifier) {
    this.element = element;
    this.notifier = notifier;
    this.pointsField = new OpenAssessment.IntField($(".openassessment_criterion_option_points", this.element), {
        min: 0,
        max: 999
    })
};
OpenAssessment.RubricOption.prototype = {
    addEventListeners: function() {
        $(this.element).focusout($.proxy(this.updateHandler, this))
    },
    getFieldValues: function() {
        var fields = {
            label: this.label(),
            points: this.points(),
            explanation: this.explanation()
        };
        var nameString = OpenAssessment.Fields.stringField($(".openassessment_criterion_option_name", this.element));
        if (nameString !== "") {
            fields.name = nameString
        }
        return fields
    },
    label: function(label) {
        var sel = $(".openassessment_criterion_option_label", this.element);
        return OpenAssessment.Fields.stringField(sel, label)
    },
    points: function(points) {
        if (points !== undefined) {
            this.pointsField.set(points)
        }
        return this.pointsField.get()
    },
    explanation: function(explanation) {
        var sel = $(".openassessment_criterion_option_explanation", this.element);
        return OpenAssessment.Fields.stringField(sel, explanation)
    },
    addHandler: function() {
        var criterionElement = $(this.element).closest(".openassessment_criterion");
        var criterionName = $(criterionElement).data("criterion");
        var criterionLabel = $(".openassessment_criterion_label", criterionElement).val();
        var options = $(".openassessment_criterion_option", this.element.parent());
        var name = OpenAssessment.ItemUtilities.createUniqueName(options, "data-option");
        $(this.element).attr("data-criterion", criterionName).attr("data-option", name);
        $(".openassessment_criterion_option_name", this.element).attr("value", name);
        var fields = this.getFieldValues();
        this.notifier.notificationFired("optionAdd", {
            criterionName: criterionName,
            criterionLabel: criterionLabel,
            name: name,
            label: fields.label,
            points: fields.points
        })
    },
    removeHandler: function() {
        var criterionName = $(this.element).data("criterion");
        var optionName = $(this.element).data("option");
        this.notifier.notificationFired("optionRemove", {
            criterionName: criterionName,
            name: optionName
        })
    },
    updateHandler: function() {
        var fields = this.getFieldValues();
        var criterionName = $(this.element).data("criterion");
        var optionName = $(this.element).data("option");
        var optionLabel = fields.label;
        var optionPoints = fields.points;
        this.notifier.notificationFired("optionUpdated", {
            criterionName: criterionName,
            name: optionName,
            label: optionLabel,
            points: optionPoints
        })
    },
    validate: function() {
        return this.pointsField.validate()
    },
    validationErrors: function() {
        var hasError = this.pointsField.validationErrors().length > 0;
        return hasError ? ["Option points are invalid"] : []
    },
    clearValidationErrors: function() {
        this.pointsField.clearValidationErrors()
    }
};
OpenAssessment.RubricCriterion = function(element, notifier) {
    this.element = element;
    this.notifier = notifier;
    this.labelSel = $(".openassessment_criterion_label", this.element);
    this.promptSel = $(".openassessment_criterion_prompt", this.element);
    this.optionContainer = new OpenAssessment.Container(OpenAssessment.RubricOption, {
        containerElement: $(".openassessment_criterion_option_list", this.element).get(0),
        templateElement: $("#openassessment_option_template").get(0),
        addButtonElement: $(".openassessment_criterion_add_option", this.element).get(0),
        removeButtonClass: "openassessment_criterion_option_remove_button",
        containerItemClass: "openassessment_criterion_option",
        notifier: this.notifier
    })
};
OpenAssessment.RubricCriterion.prototype = {
    addEventListeners: function() {
        this.optionContainer.addEventListeners();
        $(this.element).focusout($.proxy(this.updateHandler, this))
    },
    getFieldValues: function() {
        var fields = {
            label: this.label(),
            prompt: this.prompt(),
            feedback: this.feedback(),
            options: this.optionContainer.getItemValues()
        };
        var nameString = OpenAssessment.Fields.stringField($(".openassessment_criterion_name", this.element));
        if (nameString !== "") {
            fields.name = nameString
        }
        return fields
    },
    label: function(label) {
        return OpenAssessment.Fields.stringField(this.labelSel, label)
    },
    prompt: function(prompt) {
        return OpenAssessment.Fields.stringField(this.promptSel, prompt)
    },
    feedback: function() {
        return $(".openassessment_criterion_feedback", this.element).val()
    },
    addOption: function() {
        this.optionContainer.add()
    },
    addHandler: function() {
        var criteria = $(".openassessment_criterion", this.element.parent());
        var name = OpenAssessment.ItemUtilities.createUniqueName(criteria, "data-criterion");
        $(this.element).attr("data-criterion", name);
        $(".openassessment_criterion_name", this.element).attr("value", name)
    },
    removeHandler: function() {
        var criterionName = $(this.element).data("criterion");
        this.notifier.notificationFired("criterionRemove", {
            criterionName: criterionName
        })
    },
    updateHandler: function() {
        var fields = this.getFieldValues();
        var criterionName = fields.name;
        var criterionLabel = fields.label;
        this.notifier.notificationFired("criterionUpdated", {
            criterionName: criterionName,
            criterionLabel: criterionLabel
        })
    },
    validate: function() {
        var isValid = this.prompt() !== "";
        if (!isValid) {
            this.promptSel.addClass("openassessment_highlighted_field")
        }
        $.each(this.optionContainer.getAllItems(), function() {
            isValid = this.validate() && isValid
        });
        return isValid
    },
    validationErrors: function() {
        var errors = [];
        if (this.promptSel.hasClass("openassessment_highlighted_field")) {
            errors.push("Criterion prompt is invalid.")
        }
        $.each(this.optionContainer.getAllItems(), function() {
            errors = errors.concat(this.validationErrors())
        });
        return errors
    },
    clearValidationErrors: function() {
        this.promptSel.removeClass("openassessment_highlighted_field");
        $.each(this.optionContainer.getAllItems(), function() {
            this.clearValidationErrors()
        })
    }
};
OpenAssessment.TrainingExample = function(element) {
    this.element = element;
    this.criteria = $(".openassessment_training_example_criterion_option", this.element);
    this.answer = $(".openassessment_training_example_essay_part textarea", this.element)
};
OpenAssessment.TrainingExample.prototype = {
    getFieldValues: function() {
        var optionsSelected = this.criteria.map(function() {
            return {
                criterion: $(this).data("criterion"),
                option: $(this).prop("value")
            }
        }).get();
        return {
            answer: this.answer.map(function() {
                return $(this).prop("value")
            }).get(),
            options_selected: optionsSelected
        }
    },
    addHandler: function() {
        $(".openassessment_training_example_criterion_option", this.element).each(function() {
            $("option", this).each(function() {
                OpenAssessment.ItemUtilities.refreshOptionString($(this))
            })
        })
    },
    addEventListeners: function() {},
    removeHandler: function() {},
    updateHandler: function() {},
    validate: function() {
        var isValid = true;
        this.criteria.each(function() {
            var isOptionValid = $(this).prop("value") !== "";
            isValid = isOptionValid && isValid;
            if (!isOptionValid) {
                $(this).addClass("openassessment_highlighted_field")
            }
        });
        return isValid
    },
    validationErrors: function() {
        var errors = [];
        this.criteria.each(function() {
            var hasError = $(this).hasClass("openassessment_highlighted_field");
            if (hasError) {
                errors.push("Student training example is invalid.")
            }
        });
        return errors
    },
    clearValidationErrors: function() {
        this.criteria.each(function() {
            $(this).removeClass("openassessment_highlighted_field")
        })
    }
};
OpenAssessment.StudioView = function(runtime, element, server, data) {
    this.element = element;
    this.runtime = runtime;
    this.server = server;
    this.data = data;
    this.fixModalHeight();
    this.initializeTabs();
    this.alert = (new OpenAssessment.ValidationAlert).install();
    var studentTrainingListener = new OpenAssessment.StudentTrainingListener;
    this.promptsView = new OpenAssessment.EditPromptsView($("#oa_prompts_editor_wrapper", this.element).get(0), new OpenAssessment.Notifier([studentTrainingListener]));
    var studentTrainingView = new OpenAssessment.EditStudentTrainingView($("#oa_student_training_editor", this.element).get(0));
    var peerAssessmentView = new OpenAssessment.EditPeerAssessmentView($("#oa_peer_assessment_editor", this.element).get(0));
    var selfAssessmentView = new OpenAssessment.EditSelfAssessmentView($("#oa_self_assessment_editor", this.element).get(0));
    var exampleBasedAssessmentView = new OpenAssessment.EditExampleBasedAssessmentView($("#oa_ai_assessment_editor", this.element).get(0));
    var assessmentLookupDictionary = {};
    assessmentLookupDictionary[studentTrainingView.getID()] = studentTrainingView;
    assessmentLookupDictionary[peerAssessmentView.getID()] = peerAssessmentView;
    assessmentLookupDictionary[selfAssessmentView.getID()] = selfAssessmentView;
    assessmentLookupDictionary[exampleBasedAssessmentView.getID()] = exampleBasedAssessmentView;
    this.settingsView = new OpenAssessment.EditSettingsView($("#oa_basic_settings_editor", this.element).get(0), assessmentLookupDictionary, data);
    this.rubricView = new OpenAssessment.EditRubricView($("#oa_rubric_editor_wrapper", this.element).get(0), new OpenAssessment.Notifier([studentTrainingListener]));
    $(".openassessment_save_button", this.element).click($.proxy(this.save, this));
    $(".openassessment_cancel_button", this.element).click($.proxy(this.cancel, this))
};
OpenAssessment.StudioView.prototype = {
    fixModalHeight: function() {
        $(this.element).addClass("openassessment_full_height").parentsUntil(".modal-window").addClass("openassessment_full_height");
        $(this.element).closest(".modal-window").addClass("openassessment_modal_window")
    },
    initializeTabs: function() {
        if (typeof OpenAssessment.lastOpenEditingTab === "undefined") {
            OpenAssessment.lastOpenEditingTab = 2
        }
        $(".openassessment_editor_content_and_tabs", this.element).tabs({
            active: OpenAssessment.lastOpenEditingTab
        })
    },
    saveTabState: function() {
        var tabElement = $(".openassessment_editor_content_and_tabs", this.element);
        OpenAssessment.lastOpenEditingTab = tabElement.tabs("option", "active")
    },
    save: function() {
        var view = this;
        this.saveTabState();
        this.clearValidationErrors();
        if (!this.validate()) {
            this.alert.setMessage(gettext("Couldn't Save This Assignment"), gettext("Please correct the outlined fields.")).show()
        } else {
            this.alert.hide();
            this.server.checkReleased().done(function(isReleased) {
                if (isReleased) {
                    view.confirmPostReleaseUpdate($.proxy(view.updateEditorContext, view))
                } else {
                    view.updateEditorContext()
                }
            }).fail(function(errMsg) {
                view.showError(errMsg)
            })
        }
    },
    confirmPostReleaseUpdate: function(onConfirm) {
        var msg = gettext("This problem has already been released. Any changes will apply only to future assessments.");
        if (confirm(msg)) {
            onConfirm()
        }
    },
    updateEditorContext: function() {
        this.runtime.notify("save", {
            state: "start"
        });
        var view = this;
        this.server.updateEditorContext({
            prompts: view.promptsView.promptsDefinition(),
            feedbackPrompt: view.rubricView.feedbackPrompt(),
            feedback_default_text: view.rubricView.feedback_default_text(),
            criteria: view.rubricView.criteriaDefinition(),
            title: view.settingsView.displayName(),
            submissionStart: view.settingsView.submissionStart(),
            submissionDue: view.settingsView.submissionDue(),
            assessments: view.settingsView.assessmentsDescription(),
            fileUploadType: view.settingsView.fileUploadType(),
            fileTypeWhiteList: view.settingsView.fileTypeWhiteList(),
            latexEnabled: view.settingsView.latexEnabled(),
            leaderboardNum: view.settingsView.leaderboardNum(),
            editorAssessmentsOrder: view.settingsView.editorAssessmentsOrder()
        }).done(function() {
            view.runtime.notify("save", {
                state: "end"
            })
        }).fail(function(msg) {
            view.showError(msg)
        })
    },
    cancel: function() {
        this.saveTabState();
        this.runtime.notify("cancel", {})
    },
    showError: function(errorMsg) {
        this.runtime.notify("error", {
            msg: errorMsg
        })
    },
    validate: function() {
        var settingsValid = this.settingsView.validate();
        var rubricValid = this.rubricView.validate();
        var promptsValid = this.promptsView.validate();
        return settingsValid && rubricValid && promptsValid
    },
    validationErrors: function() {
        return this.settingsView.validationErrors().concat(this.rubricView.validationErrors().concat(this.promptsView.validationErrors()))
    },
    clearValidationErrors: function() {
        this.settingsView.clearValidationErrors();
        this.rubricView.clearValidationErrors();
        this.promptsView.clearValidationErrors()
    }
};

function OpenAssessmentEditor(runtime, element, data) {
    var server = new OpenAssessment.Server(runtime, element);
    new OpenAssessment.StudioView(runtime, element, server, data)
}
OpenAssessment.EditPeerAssessmentView = function(element) {
    this.element = element;
    this.name = "peer-assessment";
    this.mustGradeField = new OpenAssessment.IntField($("#peer_assessment_must_grade", this.element), {
        min: 0,
        max: 99
    });
    this.mustBeGradedByField = new OpenAssessment.IntField($("#peer_assessment_graded_by", this.element), {
        min: 0,
        max: 99
    });
    new OpenAssessment.ToggleControl($("#include_peer_assessment", this.element), $("#peer_assessment_settings_editor", this.element), $("#peer_assessment_description_closed", this.element), new OpenAssessment.Notifier([new OpenAssessment.AssessmentToggleListener])).install();
    this.startDatetimeControl = new OpenAssessment.DatetimeControl(this.element, "#peer_assessment_start_date", "#peer_assessment_start_time").install();
    this.dueDatetimeControl = new OpenAssessment.DatetimeControl(this.element, "#peer_assessment_due_date", "#peer_assessment_due_time").install()
};
OpenAssessment.EditPeerAssessmentView.prototype = {
    description: function() {
        return {
            must_grade: this.mustGradeNum(),
            must_be_graded_by: this.mustBeGradedByNum(),
            start: this.startDatetime(),
            due: this.dueDatetime()
        }
    },
    isEnabled: function(isEnabled) {
        var sel = $("#include_peer_assessment", this.element);
        return OpenAssessment.Fields.booleanField(sel, isEnabled)
    },
    toggleEnabled: function() {
        $("#include_peer_assessment", this.element).click()
    },
    mustGradeNum: function(num) {
        if (num !== undefined) {
            this.mustGradeField.set(num)
        }
        return this.mustGradeField.get()
    },
    mustBeGradedByNum: function(num) {
        if (num !== undefined) {
            this.mustBeGradedByField.set(num)
        }
        return this.mustBeGradedByField.get()
    },
    startDatetime: function(dateString, timeString) {
        return this.startDatetimeControl.datetime(dateString, timeString)
    },
    dueDatetime: function(dateString, timeString) {
        return this.dueDatetimeControl.datetime(dateString, timeString)
    },
    getID: function() {
        return $(this.element).attr("id")
    },
    validate: function() {
        var startValid = this.startDatetimeControl.validate();
        var dueValid = this.dueDatetimeControl.validate();
        var mustGradeValid = this.mustGradeField.validate();
        var mustBeGradedByValid = this.mustBeGradedByField.validate();
        return startValid && dueValid && mustGradeValid && mustBeGradedByValid
    },
    validationErrors: function() {
        var errors = [];
        if (this.startDatetimeControl.validationErrors().length > 0) {
            errors.push("Peer assessment start is invalid")
        }
        if (this.dueDatetimeControl.validationErrors().length > 0) {
            errors.push("Peer assessment due is invalid")
        }
        if (this.mustGradeField.validationErrors().length > 0) {
            errors.push("Peer assessment must grade is invalid")
        }
        if (this.mustBeGradedByField.validationErrors().length > 0) {
            errors.push("Peer assessment must be graded by is invalid")
        }
        return errors
    },
    clearValidationErrors: function() {
        this.startDatetimeControl.clearValidationErrors();
        this.dueDatetimeControl.clearValidationErrors();
        this.mustGradeField.clearValidationErrors();
        this.mustBeGradedByField.clearValidationErrors()
    }
};
OpenAssessment.EditSelfAssessmentView = function(element) {
    this.element = element;
    this.name = "self-assessment";
    new OpenAssessment.ToggleControl($("#include_self_assessment", this.element), $("#self_assessment_settings_editor", this.element), $("#self_assessment_description_closed", this.element), new OpenAssessment.Notifier([new OpenAssessment.AssessmentToggleListener])).install();
    this.startDatetimeControl = new OpenAssessment.DatetimeControl(this.element, "#self_assessment_start_date", "#self_assessment_start_time").install();
    this.dueDatetimeControl = new OpenAssessment.DatetimeControl(this.element, "#self_assessment_due_date", "#self_assessment_due_time").install()
};
OpenAssessment.EditSelfAssessmentView.prototype = {
    description: function() {
        return {
            start: this.startDatetime(),
            due: this.dueDatetime()
        }
    },
    isEnabled: function(isEnabled) {
        var sel = $("#include_self_assessment", this.element);
        return OpenAssessment.Fields.booleanField(sel, isEnabled)
    },
    toggleEnabled: function() {
        $("#include_self_assessment", this.element).click()
    },
    startDatetime: function(dateString, timeString) {
        return this.startDatetimeControl.datetime(dateString, timeString)
    },
    dueDatetime: function(dateString, timeString) {
        return this.dueDatetimeControl.datetime(dateString, timeString)
    },
    getID: function() {
        return $(this.element).attr("id")
    },
    validate: function() {
        var startValid = this.startDatetimeControl.validate();
        var dueValid = this.dueDatetimeControl.validate();
        return startValid && dueValid
    },
    validationErrors: function() {
        var errors = [];
        if (this.startDatetimeControl.validationErrors().length > 0) {
            errors.push("Self assessment start is invalid")
        }
        if (this.dueDatetimeControl.validationErrors().length > 0) {
            errors.push("Self assessment due is invalid")
        }
        return errors
    },
    clearValidationErrors: function() {
        this.startDatetimeControl.clearValidationErrors();
        this.dueDatetimeControl.clearValidationErrors()
    }
};
OpenAssessment.EditStudentTrainingView = function(element) {
    this.element = element;
    this.name = "student-training";
    new OpenAssessment.ToggleControl($("#include_student_training", this.element), $("#student_training_settings_editor", this.element), $("#student_training_description_closed", this.element), new OpenAssessment.Notifier([new OpenAssessment.AssessmentToggleListener])).install();
    this.exampleContainer = new OpenAssessment.Container(OpenAssessment.TrainingExample, {
        containerElement: $("#openassessment_training_example_list", this.element).get(0),
        templateElement: $("#openassessment_training_example_template", this.element).get(0),
        addButtonElement: $(".openassessment_add_training_example", this.element).get(0),
        removeButtonClass: "openassessment_training_example_remove",
        containerItemClass: "openassessment_training_example"
    });
    this.exampleContainer.addEventListeners()
};
OpenAssessment.EditStudentTrainingView.prototype = {
    description: function() {
        return {
            examples: this.exampleContainer.getItemValues()
        }
    },
    isEnabled: function(isEnabled) {
        var sel = $("#include_student_training", this.element);
        return OpenAssessment.Fields.booleanField(sel, isEnabled)
    },
    toggleEnabled: function() {
        $("#include_student_training", this.element).click()
    },
    getID: function() {
        return $(this.element).attr("id")
    },
    validate: function() {
        var isValid = true;
        $.each(this.exampleContainer.getAllItems(), function() {
            isValid = this.validate() && isValid
        });
        return isValid
    },
    validationErrors: function() {
        var errors = [];
        $.each(this.exampleContainer.getAllItems(), function() {
            errors = errors.concat(this.validationErrors())
        });
        return errors
    },
    clearValidationErrors: function() {
        $.each(this.exampleContainer.getAllItems(), function() {
            this.clearValidationErrors()
        })
    },
    addTrainingExample: function() {
        this.exampleContainer.add()
    }
};
OpenAssessment.EditExampleBasedAssessmentView = function(element) {
    this.element = element;
    this.name = "example-based-assessment";
    new OpenAssessment.ToggleControl($("#include_ai_assessment", this.element), $("#ai_assessment_settings_editor", this.element), $("#ai_assessment_description_closed", this.element), new OpenAssessment.Notifier([new OpenAssessment.AssessmentToggleListener])).install()
};
OpenAssessment.EditExampleBasedAssessmentView.prototype = {
    description: function() {
        return {
            examples_xml: this.exampleDefinitions()
        }
    },
    isEnabled: function(isEnabled) {
        var sel = $("#include_ai_assessment", this.element);
        return OpenAssessment.Fields.booleanField(sel, isEnabled)
    },
    toggleEnabled: function() {
        $("#include_ai_assessment", this.element).click()
    },
    exampleDefinitions: function(xml) {
        var sel = $("#ai_training_examples", this.element);
        return OpenAssessment.Fields.stringField(sel, xml)
    },
    getID: function() {
        return $(this.element).attr("id")
    },
    validate: function() {
        return true
    },
    validationErrors: function() {
        return []
    },
    clearValidationErrors: function() {}
};
OpenAssessment.Fields = {
    stringField: function(sel, value) {
        if (value !== undefined) {
            sel.val(value)
        }
        return sel.val()
    },
    booleanField: function(sel, value) {
        if (value !== undefined) {
            sel.prop("checked", value)
        }
        return sel.prop("checked")
    }
};
OpenAssessment.IntField = function(inputSel, restrictions) {
    this.max = restrictions.max;
    this.min = restrictions.min;
    this.input = $(inputSel)
};
OpenAssessment.IntField.prototype = {
    get: function() {
        return parseInt(this.input.val().trim(), 10)
    },
    set: function(val) {
        this.input.val(val)
    },
    validate: function() {
        var value = this.get();
        var isValid = !isNaN(value) && value >= this.min && value <= this.max;
        if (this.input.val().indexOf(".") !== -1) {
            isValid = false
        }
        if (!isValid) {
            this.input.addClass("openassessment_highlighted_field")
        }
        return isValid
    },
    clearValidationErrors: function() {
        this.input.removeClass("openassessment_highlighted_field")
    },
    validationErrors: function() {
        var hasError = this.input.hasClass("openassessment_highlighted_field");
        return hasError ? ["Int field is invalid"] : []
    }
};
OpenAssessment.ToggleControl = function(checkboxSel, shownSel, hiddenSel, notifier) {
    this.checkbox = checkboxSel;
    this.shownSection = shownSel;
    this.hiddenSection = hiddenSel;
    this.notifier = notifier
};
OpenAssessment.ToggleControl.prototype = {
    install: function() {
        this.checkbox.change(this, function(event) {
            var control = event.data;
            if (this.checked) {
                control.notifier.notificationFired("toggleOn", {});
                control.show()
            } else {
                control.notifier.notificationFired("toggleOff", {});
                control.hide()
            }
        });
        return this
    },
    show: function() {
        this.shownSection.removeClass("is--hidden");
        this.hiddenSection.addClass("is--hidden")
    },
    hide: function() {
        this.shownSection.addClass("is--hidden");
        this.hiddenSection.removeClass("is--hidden")
    }
};
OpenAssessment.DatetimeControl = function(element, datePicker, timePicker) {
    this.element = element;
    this.datePicker = datePicker;
    this.timePicker = timePicker
};
OpenAssessment.DatetimeControl.prototype = {
    install: function() {
        var dateString = $(this.datePicker, this.element).val();
        $(this.datePicker, this.element).datepicker({
            showButtonPanel: true
        }).datepicker("option", "dateFormat", "yy-mm-dd").datepicker("setDate", dateString);
        $(this.timePicker, this.element).timepicker({
            timeFormat: "H:i",
            step: 60
        });
        return this
    },
    datetime: function(dateString, timeString) {
        var datePickerSel = $(this.datePicker, this.element);
        var timePickerSel = $(this.timePicker, this.element);
        if (typeof dateString !== "undefined") {
            datePickerSel.val(dateString)
        }
        if (typeof timeString !== "undefined") {
            timePickerSel.val(timeString)
        }
        return datePickerSel.val() + "T" + timePickerSel.val()
    },
    validate: function() {
        var dateString = $(this.datePicker, this.element).val();
        var timeString = $(this.timePicker, this.element).val();
        var isDateValid = false;
        try {
            var parsedDate = $.datepicker.parseDate($.datepicker.ISO_8601, dateString);
            isDateValid = parsedDate instanceof Date
        } catch (err) {}
        if (!isDateValid) {
            $(this.datePicker, this.element).addClass("openassessment_highlighted_field")
        }
        var matches = timeString.match(/^\d{2}:\d{2}$/g);
        var isTimeValid = matches !== null;
        if (!isTimeValid) {
            $(this.timePicker, this.element).addClass("openassessment_highlighted_field")
        }
        return isDateValid && isTimeValid
    },
    clearValidationErrors: function() {
        $(this.datePicker, this.element).removeClass("openassessment_highlighted_field");
        $(this.timePicker, this.element).removeClass("openassessment_highlighted_field")
    },
    validationErrors: function() {
        var errors = [];
        var dateHasError = $(this.datePicker, this.element).hasClass("openassessment_highlighted_field");
        var timeHasError = $(this.timePicker, this.element).hasClass("openassessment_highlighted_field");
        if (dateHasError) {
            errors.push("Date is invalid")
        }
        if (timeHasError) {
            errors.push("Time is invalid")
        }
        return errors
    }
};
OpenAssessment.SelectControl = function(selectSel, mapping, notifier) {
    this.select = selectSel;
    this.mapping = mapping;
    this.notifier = notifier
};
OpenAssessment.SelectControl.prototype = {
    install: function() {
        this.select.change(this, function(event) {
            var control = event.data;
            control.notifier.notificationFired("selectionChanged", {
                selected: this.value
            });
            control.change(this.value)
        });
        return this
    },
    change: function(selected) {
        $.each(this.mapping, function(option, sel) {
            if (option === selected) {
                sel.removeClass("is--hidden")
            } else {
                sel.addClass("is--hidden")
            }
        })
    }
};
OpenAssessment.InputControl = function(inputSel, validator) {
    this.input = $(inputSel);
    this.validator = validator;
    this.errors = []
};
OpenAssessment.InputControl.prototype = {
    get: function() {
        return this.input.val()
    },
    set: function(val) {
        this.input.val(val)
    },
    validate: function() {
        this.errors = this.validator(this.get());
        if (this.errors.length) {
            this.input.addClass("openassessment_highlighted_field");
            this.input.parent().nextAll(".message-status").text(this.errors.join(";"));
            this.input.parent().nextAll(".message-status").addClass("is-shown")
        }
        return this.errors.length === 0
    },
    clearValidationErrors: function() {
        this.input.removeClass("openassessment_highlighted_field");
        this.input.parent().nextAll(".message-status").removeClass("is-shown")
    },
    validationErrors: function() {
        return this.errors
    }
};
OpenAssessment.StudentTrainingListener = function() {
    this.element = $("#oa_student_training_editor");
    this.alert = new OpenAssessment.ValidationAlert
};
OpenAssessment.StudentTrainingListener.prototype = {
    promptAdd: function() {
        var view = this.element;
        $("#openassessment_training_example_part_template").children().first().clone().removeAttr("id").toggleClass("is--hidden", false).appendTo(".openassessment_training_example_essay", view)
    },
    promptRemove: function(data) {
        var view = this.element;
        $(".openassessment_training_example_essay li:nth-child(" + (data.index + 1) + ")", view).remove()
    },
    optionUpdated: function(data) {
        this._optionSel(data.criterionName).each(function() {
            var criterion = this;
            var option = $('option[value="' + data.name + '"]', criterion).attr("data-points", data.points).attr("data-label", data.label);
            OpenAssessment.ItemUtilities.refreshOptionString(option)
        })
    },
    optionAdd: function(data) {
        var criterionAdded = false;
        if (this._optionSel(data.criterionName).length === 0) {
            this.criterionAdd(data);
            criterionAdded = true
        }
        this._optionSel(data.criterionName).each(function() {
            var criterion = this;
            var option = $("<option></option>").attr("value", data.name).attr("data-points", data.points).attr("data-label", data.label);
            OpenAssessment.ItemUtilities.refreshOptionString(option);
            $(criterion).append(option)
        });
        if (criterionAdded) {
            this.displayAlertMsg(gettext("Criterion Added"), gettext("You have added a criterion. You will need to select an option for the criterion in the Learner Training step. To do this, click the Settings tab."))
        }
    },
    optionRemove: function(data) {
        var handler = this;
        var invalidated = false;
        this._optionSel(data.criterionName).each(function() {
            var criterionOption = this;
            if ($(criterionOption).val() === data.name.toString()) {
                $(criterionOption).val("").addClass("openassessment_highlighted_field").click(function() {
                    $(criterionOption).removeClass("openassessment_highlighted_field")
                });
                invalidated = true
            }
            $('option[value="' + data.name + '"]', criterionOption).remove();
            if ($("option", criterionOption).length === 1) {
                handler.removeAllOptions(data);
                invalidated = false
            }
        });
        if (invalidated) {
            this.displayAlertMsg(gettext("Option Deleted"), gettext("You have deleted an option. That option has been removed from its criterion in the sample responses in the Learner Training step. You might have to select a new option for the criterion."))
        }
    },
    _optionSel: function(criterionName) {
        return $('.openassessment_training_example_criterion_option[data-criterion="' + criterionName + '"]', this.element)
    },
    removeAllOptions: function(data) {
        var changed = false;
        $(".openassessment_training_example_criterion", this.element).each(function() {
            var criterion = this;
            if ($(criterion).data("criterion") === data.criterionName) {
                $(criterion).remove();
                changed = true
            }
        });
        if (changed) {
            this.displayAlertMsg(gettext("Option Deleted"), gettext("You have deleted all the options for this criterion. The criterion has been removed from the sample responses in the Learner Training step."))
        }
    },
    criterionRemove: function(data) {
        var changed = false;
        var sel = '.openassessment_training_example_criterion[data-criterion="' + data.criterionName + '"]';
        $(sel, this.element).each(function() {
            $(this).remove();
            changed = true
        });
        if (changed) {
            this.displayAlertMsg(gettext("Criterion Deleted"), gettext("You have deleted a criterion. The criterion has been removed from the example responses in the Learner Training step."))
        }
    },
    displayAlertMsg: function(title, msg) {
        if ($("#include_student_training", this.element).is(":checked") && $(".openassessment_training_example", this.element).length > 1) {
            this.alert.setMessage(title, msg).show()
        }
    },
    criterionUpdated: function(data) {
        var sel = '.openassessment_training_example_criterion[data-criterion="' + data.criterionName + '"]';
        $(sel, this.element).each(function() {
            $(".openassessment_training_example_criterion_name_wrapper", this).text(data.criterionLabel)
        })
    },
    criterionAdd: function(data) {
        var view = this.element;
        var criterion = $("#openassessment_training_example_criterion_template").children().first().clone().removeAttr("id").attr("data-criterion", data.criterionName).toggleClass("is--hidden", false).appendTo(".openassessment_training_example_criteria_selections", view);
        criterion.find(".openassessment_training_example_criterion_option").attr("data-criterion", data.criterionName);
        criterion.find(".openassessment_training_example_criterion_name_wrapper").text(data.label)
    },
    examplesCriteriaLabels: function() {
        var examples = [];
        $(".openassessment_training_example_criteria_selections", this.element).each(function() {
            var exampleDescription = {};
            $(".openassessment_training_example_criterion", this).each(function() {
                var criterionName = $(this).data("criterion");
                var criterionLabel = $(".openassessment_training_example_criterion_name_wrapper", this).text().trim();
                exampleDescription[criterionName] = criterionLabel
            });
            examples.push(exampleDescription)
        });
        return examples
    },
    examplesOptionsLabels: function() {
        var examples = [];
        $(".openassessment_training_example_criteria_selections", this.element).each(function() {
            var exampleDescription = {};
            $(".openassessment_training_example_criterion_option", this).each(function() {
                var criterionName = $(this).data("criterion");
                exampleDescription[criterionName] = {};
                $("option", this).each(function() {
                    var optionName = $(this).val();
                    var optionLabel = $(this).text().trim();
                    exampleDescription[criterionName][optionName] = optionLabel
                })
            });
            examples.push(exampleDescription)
        });
        return examples
    }
};
OpenAssessment.AssessmentToggleListener = function() {
    this.alert = new OpenAssessment.ValidationAlert
};
OpenAssessment.AssessmentToggleListener.prototype = {
    toggleOff: function() {
        this.alert.setMessage(gettext("Warning"), gettext("Changes to steps that are not selected as part of the assignment will not be saved.")).show()
    },
    toggleOn: function() {
        this.alert.hide()
    }
};
OpenAssessment.Notifier = function(listeners) {
    this.listeners = listeners
};
OpenAssessment.Notifier.prototype = {
    notificationFired: function(name, data) {
        for (var i = 0; i < this.listeners.length; i++) {
            if (typeof this.listeners[i][name] === "function") {
                this.listeners[i][name](data)
            }
        }
    }
};
OpenAssessment.EditPromptsView = function(element, notifier) {
    this.element = element;
    this.editorElement = $(this.element).closest("#openassessment-editor");
    this.addRemoveEnabled = this.editorElement.attr("data-is-released") !== "true";
    this.promptsContainer = new OpenAssessment.Container(OpenAssessment.Prompt, {
        containerElement: $("#openassessment_prompts_list", this.element).get(0),
        templateElement: $("#openassessment_prompt_template", this.element).get(0),
        addButtonElement: $("#openassessment_prompts_add_prompt", this.element).get(0),
        removeButtonClass: "openassessment_prompt_remove_button",
        containerItemClass: "openassessment_prompt",
        notifier: notifier,
        addRemoveEnabled: this.addRemoveEnabled
    });
    this.promptsContainer.addEventListeners()
};
OpenAssessment.EditPromptsView.prototype = {
    promptsDefinition: function() {
        var prompts = this.promptsContainer.getItemValues();
        return prompts
    },
    addPrompt: function() {
        if (this.addRemoveEnabled) {
            this.promptsContainer.add()
        }
    },
    removePrompt: function(item) {
        if (this.addRemoveEnabled) {
            this.promptsContainer.remove(item)
        }
    },
    getAllPrompts: function() {
        return this.promptsContainer.getAllItems()
    },
    getPromptItem: function(index) {
        return this.promptsContainer.getItem(index)
    },
    validate: function() {
        return true
    },
    validationErrors: function() {
        var errors = [];
        return errors
    },
    clearValidationErrors: function() {}
};
OpenAssessment.EditRubricView = function(element, notifier) {
    this.element = element;
    this.criterionAddButton = $("#openassessment_rubric_add_criterion", this.element);
    this.criteriaContainer = new OpenAssessment.Container(OpenAssessment.RubricCriterion, {
        containerElement: $("#openassessment_criterion_list", this.element).get(0),
        templateElement: $("#openassessment_criterion_template", this.element).get(0),
        addButtonElement: $("#openassessment_rubric_add_criterion", this.element).get(0),
        removeButtonClass: "openassessment_criterion_remove_button",
        containerItemClass: "openassessment_criterion",
        notifier: notifier
    });
    this.criteriaContainer.addEventListeners()
};
OpenAssessment.EditRubricView.prototype = {
    criteriaDefinition: function() {
        var criteria = this.criteriaContainer.getItemValues();
        for (var criterion_idx = 0; criterion_idx < criteria.length; criterion_idx++) {
            var criterion = criteria[criterion_idx];
            criterion.order_num = criterion_idx;
            for (var option_idx = 0; option_idx < criterion.options.length; option_idx++) {
                var option = criterion.options[option_idx];
                option.order_num = option_idx
            }
        }
        return criteria
    },
    feedbackPrompt: function(text) {
        var sel = $("#openassessment_rubric_feedback", this.element);
        return OpenAssessment.Fields.stringField(sel, text)
    },
    feedback_default_text: function(text) {
        var sel = $("#openassessment_rubric_feedback_default_text", this.element);
        return OpenAssessment.Fields.stringField(sel, text)
    },
    addCriterion: function() {
        this.criteriaContainer.add()
    },
    removeCriterion: function(item) {
        this.criteriaContainer.remove(item)
    },
    getAllCriteria: function() {
        return this.criteriaContainer.getAllItems()
    },
    getCriterionItem: function(index) {
        return this.criteriaContainer.getItem(index)
    },
    addOption: function(criterionIndex) {
        var criterionItem = this.getCriterionItem(criterionIndex);
        criterionItem.optionContainer.add()
    },
    removeOption: function(criterionIndex, item) {
        var criterionItem = this.getCriterionItem(criterionIndex);
        criterionItem.optionContainer.remove(item)
    },
    getAllOptions: function(criterionIndex) {
        var criterionItem = this.getCriterionItem(criterionIndex);
        return criterionItem.optionContainer.getAllItems()
    },
    getOptionItem: function(criterionIndex, optionIndex) {
        var criterionItem = this.getCriterionItem(criterionIndex);
        return criterionItem.optionContainer.getItem(optionIndex)
    },
    validate: function() {
        var criteria = this.getAllCriteria();
        var isValid = criteria.length > 0;
        if (!isValid) {
            this.criterionAddButton.addClass("openassessment_highlighted_field").click(function() {
                $(this).removeClass("openassessment_highlighted_field")
            })
        }
        $.each(criteria, function() {
            isValid = this.validate() && isValid
        });
        return isValid
    },
    validationErrors: function() {
        var errors = [];
        if (this.criterionAddButton.hasClass("openassessment_highlighted_field")) {
            errors.push("The rubric must contain at least one criterion")
        }
        $.each(this.getAllCriteria(), function() {
            errors = errors.concat(this.validationErrors())
        });
        return errors
    },
    clearValidationErrors: function() {
        this.criterionAddButton.removeClass("openassessment_highlighted_field");
        $.each(this.getAllCriteria(), function() {
            this.clearValidationErrors()
        })
    }
};
OpenAssessment.EditSettingsView = function(element, assessmentViews, data) {
    this.settingsElement = element;
    this.assessmentsElement = $(element).siblings("#openassessment_assessment_module_settings_editors").get(0);
    this.assessmentViews = assessmentViews;
    this.startDatetimeControl = new OpenAssessment.DatetimeControl(this.element, "#openassessment_submission_start_date", "#openassessment_submission_start_time").install();
    this.dueDatetimeControl = new OpenAssessment.DatetimeControl(this.element, "#openassessment_submission_due_date", "#openassessment_submission_due_time").install();
    new OpenAssessment.SelectControl($("#openassessment_submission_upload_selector", this.element), {
        custom: $("#openassessment_submission_white_listed_file_types_wrapper", this.element)
    }, new OpenAssessment.Notifier([new OpenAssessment.AssessmentToggleListener])).install();
    this.leaderboardIntField = new OpenAssessment.IntField($("#openassessment_leaderboard_editor", this.element), {
        min: 0,
        max: 100
    });
    this.fileTypeWhiteListInputField = new OpenAssessment.InputControl($("#openassessment_submission_white_listed_file_types", this.element), function(value) {
        var badExts = [];
        var errors = [];
        if (!value) {
            errors.push(gettext("File types can not be empty."));
            return errors
        }
        var whiteList = $.map(value.replace(/\./g, "").toLowerCase().split(","), $.trim);
        $.each(whiteList, function(index, ext) {
            if (data.FILE_EXT_BLACK_LIST.indexOf(ext) !== -1) {
                badExts.push(ext)
            }
        });
        if (badExts.length) {
            errors.push(gettext("The following file types are not allowed: ") + badExts.join(","))
        }
        return errors
    });
    this.initializeSortableAssessments()
};
OpenAssessment.EditSettingsView.prototype = {
    initializeSortableAssessments: function() {
        var view = this;
        $("#openassessment_assessment_module_settings_editors", view.element).sortable({
            start: function(event, ui) {
                $(".openassessment_assessment_module_editor", view.element).hide();
                var targetHeight = "auto";
                ui.placeholder.height(targetHeight);
                ui.helper.height(targetHeight);
                $("#openassessment_assessment_module_settings_editors", view.element).sortable("refresh").sortable("refreshPositions")
            },
            stop: function() {
                $(".openassessment_assessment_module_editor", view.element).show()
            },
            snap: true,
            axis: "y",
            handle: ".drag-handle",
            cursorAt: {
                top: 20
            }
        });
        $("#openassessment_assessment_module_settings_editors .drag-handle", view.element).disableSelection()
    },
    displayName: function(name) {
        var sel = $("#openassessment_title_editor", this.settingsElement);
        return OpenAssessment.Fields.stringField(sel, name)
    },
    submissionStart: function(dateString, timeString) {
        return this.startDatetimeControl.datetime(dateString, timeString)
    },
    submissionDue: function(dateString, timeString) {
        return this.dueDatetimeControl.datetime(dateString, timeString)
    },
    fileUploadType: function(uploadType) {
        var sel = $("#openassessment_submission_upload_selector", this.settingsElement);
        if (uploadType !== undefined) {
            sel.val(uploadType)
        }
        return sel.val()
    },
    fileTypeWhiteList: function(exts) {
        if (exts !== undefined) {
            this.fileTypeWhiteListInputField.set(exts)
        }
        return this.fileTypeWhiteListInputField.get()
    },
    latexEnabled: function(isEnabled) {
        var sel = $("#openassessment_submission_latex_editor", this.settingsElement);
        if (isEnabled !== undefined) {
            if (isEnabled) {
                sel.val(1)
            } else {
                sel.val(0)
            }
        }
        return sel.val() === 1
    },
    leaderboardNum: function(num) {
        if (num !== undefined) {
            this.leaderboardIntField.set(num)
        }
        return this.leaderboardIntField.get(num)
    },
    assessmentsDescription: function() {
        var assessmentDescList = [];
        var view = this;
        $(".openassessment_assessment_module_settings_editor", this.assessmentsElement).each(function() {
            var asmntView = view.assessmentViews[$(this).attr("id")];
            if (asmntView.isEnabled()) {
                var description = asmntView.description();
                description.name = asmntView.name;
                assessmentDescList.push(description)
            }
        });
        return assessmentDescList
    },
    editorAssessmentsOrder: function() {
        var editorAssessments = [];
        var view = this;
        $(".openassessment_assessment_module_settings_editor", this.assessmentsElement).each(function() {
            var asmntView = view.assessmentViews[$(this).attr("id")];
            editorAssessments.push(asmntView.name)
        });
        return editorAssessments
    },
    validate: function() {
        var isValid = true;
        isValid = this.startDatetimeControl.validate() && isValid;
        isValid = this.dueDatetimeControl.validate() && isValid;
        isValid = this.leaderboardIntField.validate() && isValid;
        if (this.fileUploadType() === "custom") {
            isValid = this.fileTypeWhiteListInputField.validate() && isValid
        } else {
            if (this.fileTypeWhiteListInputField.get() && !this.fileTypeWhiteListInputField.validate()) {
                this.fileTypeWhiteListInputField.set("")
            }
        }
        $.each(this.assessmentViews, function() {
            if (this.isEnabled()) {
                isValid = this.validate() && isValid
            }
        });
        return isValid
    },
    validationErrors: function() {
        var errors = [];
        if (this.startDatetimeControl.validationErrors().length > 0) {
            errors.push("Submission start is invalid")
        }
        if (this.dueDatetimeControl.validationErrors().length > 0) {
            errors.push("Submission due is invalid")
        }
        if (this.leaderboardIntField.validationErrors().length > 0) {
            errors.push("Leaderboard number is invalid")
        }
        if (this.fileTypeWhiteListInputField.validationErrors().length > 0) {
            errors = errors.concat(this.fileTypeWhiteListInputField.validationErrors())
        }
        $.each(this.assessmentViews, function() {
            errors = errors.concat(this.validationErrors())
        });
        return errors
    },
    clearValidationErrors: function() {
        this.startDatetimeControl.clearValidationErrors();
        this.dueDatetimeControl.clearValidationErrors();
        this.leaderboardIntField.clearValidationErrors();
        this.fileTypeWhiteListInputField.clearValidationErrors();
        $.each(this.assessmentViews, function() {
            this.clearValidationErrors()
        })
    }
};
OpenAssessment.ValidationAlert = function() {
    this.element = $("#openassessment_validation_alert");
    this.editorElement = $(this.element).parent();
    this.title = $(".openassessment_alert_title", this.element);
    this.message = $(".openassessment_alert_message", this.element);
    this.closeButton = $(".openassessment_alert_close", this.element);
    this.ALERT_YELLOW = "rgb(192, 172, 0)";
    this.DARK_GREY = "#323232"
};
OpenAssessment.ValidationAlert.prototype = {
    install: function() {
        var alert = this;
        this.closeButton.click(function(eventObject) {
            eventObject.preventDefault();
            alert.hide()
        });
        return this
    },
    hide: function() {
        var headerHeight = $("#openassessment_editor_header", this.editorElement).outerHeight();
        this.element.addClass("covered");
        var styles = {
            height: "Calc(100% - " + headerHeight + "px)",
            "border-top-right-radius": "3px",
            "border-top-left-radius": "3px"
        };
        $(".oa_editor_content_wrapper", this.editorElement).each(function() {
            $(this).css(styles)
        });
        return this
    },
    show: function() {
        var view = this;
        if (this.isVisible()) {
            $(this.element).animate({
                "background-color": view.ALERT_YELLOW
            }, 300, "swing", function() {
                $(this).animate({
                    "background-color": view.DARK_GREY
                }, 700, "swing")
            })
        } else {
            this.element.removeClass("covered");
            var alertHeight = this.element.outerHeight();
            var headerHeight = $("#openassessment_editor_header", this.editorElement).outerHeight();
            var heightString = "Calc(100% - " + (alertHeight + headerHeight) + "px)";
            var styles = {
                height: heightString,
                "border-top-right-radius": "0px",
                "border-top-left-radius": "0px"
            };
            $(".oa_editor_content_wrapper", this.editorElement).each(function() {
                $(this).css(styles)
            })
        }
        return this
    },
    setMessage: function(newTitle, newMessage) {
        this.title.text(newTitle);
        this.message.text(newMessage);
        return this
    },
    isVisible: function() {
        return !this.element.hasClass("covered")
    },
    getTitle: function() {
        return this.title.text()
    },
    getMessage: function() {
        return this.message.text()
    }
};
