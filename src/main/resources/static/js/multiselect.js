/*
 * @license
 *
 * Multiselect v2.4.0
 * http://crlcu.github.io/multiselect/
 *
 * Copyright (c) 2016 Adrian Crisan
 * Licensed under the MIT license (https://github.com/crlcu/multiselect/blob/master/LICENSE)
 */
if ("undefined" == typeof jQuery) throw new Error("multiselect requires jQuery");
! function(t) {
    "use strict";
    var e = t.fn.jquery.split(" ")[0].split(".");
    if (e[0] < 2 && e[1] < 7) throw new Error("multiselect requires jQuery version 1.7 or higher")
}(jQuery),
    function(t) {
        "function" == typeof define && define.amd ? define(["jquery"], t) : t(jQuery)
    }(function(t) {
        "use strict";
        var e = function(t) {
            function e(e, o) {
                var n = e.prop("id");
                this.$left = e, this.$right = t(t(o.right).length ? o.right : "#" + n + "_to"), this.actions = {
                    $leftAll: t(t(o.leftAll).length ? o.leftAll : "#" + n + "_leftAll"),
                    $rightAll: t(t(o.rightAll).length ? o.rightAll : "#" + n + "_rightAll"),
                    $leftSelected: t(t(o.leftSelected).length ? o.leftSelected : "#" + n + "_leftSelected"),
                    $rightSelected: t(t(o.rightSelected).length ? o.rightSelected : "#" + n + "_rightSelected"),
                    $undo: t(t(o.undo).length ? o.undo : "#" + n + "_undo"),
                    $redo: t(t(o.redo).length ? o.redo : "#" + n + "_redo"),
                    $moveUp: t(t(o.moveUp).length ? o.moveUp : "#" + n + "_move_up"),
                    $moveDown: t(t(o.moveDown).length ? o.moveDown : "#" + n + "_move_down")
                }, delete o.leftAll, delete o.leftSelected, delete o.right, delete o.rightAll, delete o.rightSelected, delete o.undo, delete o.redo, delete o.moveUp, delete o.moveDown, this.options = {
                    keepRenderingSort: o.keepRenderingSort,
                    submitAllLeft: void 0 === o.submitAllLeft || o.submitAllLeft,
                    submitAllRight: void 0 === o.submitAllRight || o.submitAllRight,
                    search: o.search,
                    ignoreDisabled: void 0 !== o.ignoreDisabled && o.ignoreDisabled,
                    matchOptgroupBy: void 0 !== o.matchOptgroupBy ? o.matchOptgroupBy : "label"
                }, delete o.keepRenderingSort, o.submitAllLeft, o.submitAllRight, o.search, o.ignoreDisabled, o.matchOptgroupBy, this.callbacks = o, this.init()
            }
            return e.prototype = {
                init: function() {
                    var e = this;
                    e.undoStack = [], e.redoStack = [], e.options.keepRenderingSort && (e.skipInitSort = !0, e.callbacks.sort !== !1 && (e.callbacks.sort = function(e, o) {
                        return t(e).data("position") > t(o).data("position") ? 1 : -1
                    }), e.$left.attachIndex(), e.$right.each(function(e, o) {
                        t(o).attachIndex()
                    })), "function" == typeof e.callbacks.startUp && e.callbacks.startUp(e.$left, e.$right), e.skipInitSort || "function" != typeof e.callbacks.sort || (e.$left.mSort(e.callbacks.sort), e.$right.each(function(o, n) {
                        t(n).mSort(e.callbacks.sort)
                    })), e.options.search && e.options.search.left && (e.options.search.$left = t(e.options.search.left), e.$left.before(e.options.search.$left)), e.options.search && e.options.search.right && (e.options.search.$right = t(e.options.search.right), e.$right.before(t(e.options.search.$right))), e.events()
                },
                events: function() {
                    var e = this;
                    e.options.search && e.options.search.$left && e.options.search.$left.on("keyup", function(t) {
                        if (e.callbacks.fireSearch(this.value)) {
                            e.$left.find('option:search("' + this.value + '")').mShow(), e.$left.find('option:not(:search("' + this.value + '"))').mHide(), e.$left.find("option").closest("optgroup").mHide(), e.$left.find("option:not(.hidden)").parent("optgroup").mShow()
                        } else e.$left.find("option, optgroup").mShow()
                    }), e.options.search && e.options.search.$right && e.options.search.$right.on("keyup", function(t) {
                        if (e.callbacks.fireSearch(this.value)) {
                            e.$right.find('option:search("' + this.value + '")').mShow(), e.$right.find('option:not(:search("' + this.value + '"))').mHide(), e.$right.find("option").closest("optgroup").mHide(), e.$right.find("option:not(.hidden)").parent("optgroup").mShow()
                        } else e.$right.find("option, optgroup").mShow()
                    }), e.$right.closest("form").on("submit", function(t) {
                        e.options.search && (e.options.search.$left && e.options.search.$left.val("").trigger("keyup"), e.options.search.$right && e.options.search.$right.val("").trigger("keyup")), e.$left.find("option").prop("selected", e.options.submitAllLeft), e.$right.find("option").prop("selected", e.options.submitAllRight)
                    }), e.$left.on("dblclick", "option", function(t) {
                        t.preventDefault();
                        var o = e.$left.find("option:selected");
                        o.length && e.moveToRight(o, t)
                    }), e.$left.on("click", "optgroup", function(e) {
                        "OPTGROUP" == t(e.target).prop("tagName") && t(this).children().prop("selected", !0)
                    }), e.$left.on("keypress", function(t) {
                        if (13 === t.keyCode) {
                            t.preventDefault();
                            var o = e.$left.find("option:selected");
                            o.length && e.moveToRight(o, t)
                        }
                    }), e.$right.on("dblclick", "option", function(t) {
                        t.preventDefault();
                        var o = e.$right.find("option:selected");
                        o.length && e.moveToLeft(o, t)
                    }), e.$right.on("click", "optgroup", function(e) {
                        "OPTGROUP" == t(e.target).prop("tagName") && t(this).children().prop("selected", !0)
                    }), e.$right.on("keydown", function(t) {
                        if (8 === t.keyCode || 46 === t.keyCode) {
                            t.preventDefault();
                            var o = e.$right.find("option:selected");
                            o.length && e.moveToLeft(o, t)
                        }
                    }), (navigator.userAgent.match(/MSIE/i) || navigator.userAgent.indexOf("Trident/") > 0 || navigator.userAgent.indexOf("Edge/") > 0) && (e.$left.dblclick(function(t) {
                        e.actions.$rightSelected.trigger("click")
                    }), e.$right.dblclick(function(t) {
                        e.actions.$leftSelected.trigger("click")
                    })), e.actions.$rightSelected.on("click", function(o) {
                        o.preventDefault();
                        var n = e.$left.find("option:selected");
                        n.length && e.moveToRight(n, o), t(this).blur()
                    }), e.actions.$leftSelected.on("click", function(o) {
                        o.preventDefault();
                        var n = e.$right.find("option:selected");
                        n.length && e.moveToLeft(n, o), t(this).blur()
                    }), e.actions.$rightAll.on("click", function(o) {
                        o.preventDefault();
                        var n = e.$left.children(":not(span):not(.hidden)");
                        n.length && e.moveToRight(n, o), t(this).blur()
                    }), e.actions.$leftAll.on("click", function(o) {
                        o.preventDefault();
                        var n = e.$right.children(":not(span):not(.hidden)");
                        n.length && e.moveToLeft(n, o), t(this).blur()
                    }), e.actions.$undo.on("click", function(t) {
                        t.preventDefault(), e.undo(t)
                    }), e.actions.$redo.on("click", function(t) {
                        t.preventDefault(), e.redo(t)
                    }), e.actions.$moveUp.on("click", function(o) {
                        o.preventDefault();
                        var n = e.$right.find(":selected:not(span):not(.hidden)");
                        n.length && e.moveUp(n, o), t(this).blur()
                    }), e.actions.$moveDown.on("click", function(o) {
                        o.preventDefault();
                        var n = e.$right.find(":selected:not(span):not(.hidden)");
                        n.length && e.moveDown(n, o), t(this).blur()
                    })
                },
                moveToRight: function(t, e, o, n) {
                    var i = this;
                    return "function" == typeof i.callbacks.moveToRight ? i.callbacks.moveToRight(i, t, e, o, n) : !("function" == typeof i.callbacks.beforeMoveToRight && !o && !i.callbacks.beforeMoveToRight(i.$left, i.$right, t)) && (i.moveFromAtoB(i.$left, i.$right, t, e, o, n), n || (i.undoStack.push(["right", t]), i.redoStack = []), "function" != typeof i.callbacks.sort || o || i.doNotSortRight || i.$right.mSort(i.callbacks.sort), "function" != typeof i.callbacks.afterMoveToRight || o || i.callbacks.afterMoveToRight(i.$left, i.$right, t), i)
                },
                moveToLeft: function(t, e, o, n) {
                    var i = this;
                    return "function" == typeof i.callbacks.moveToLeft ? i.callbacks.moveToLeft(i, t, e, o, n) : !("function" == typeof i.callbacks.beforeMoveToLeft && !o && !i.callbacks.beforeMoveToLeft(i.$left, i.$right, t)) && (i.moveFromAtoB(i.$right, i.$left, t, e, o, n), n || (i.undoStack.push(["left", t]), i.redoStack = []), "function" != typeof i.callbacks.sort || o || i.$left.mSort(i.callbacks.sort), "function" != typeof i.callbacks.afterMoveToLeft || o || i.callbacks.afterMoveToLeft(i.$left, i.$right, t), i)
                },
                moveFromAtoB: function(e, o, n, i, r, l) {
                    var c = this;
                    return "function" == typeof c.callbacks.moveFromAtoB ? c.callbacks.moveFromAtoB(c, e, o, n, i, r, l) : (n.each(function(e, n) {
                        var i = t(n);
                        if (c.options.ignoreDisabled && i.is(":disabled")) return !0;
                        if (i.is("optgroup") || i.parent().is("optgroup")) {
                            var r = i.is("optgroup") ? i : i.parent(),
                                l = "optgroup[" + c.options.matchOptgroupBy + '="' + r.prop(c.options.matchOptgroupBy) + '"]',
                                a = o.find(l);
                            a.length || (a = r.clone(!0), a.empty(), o.move(a)), i.is("optgroup") ? a.move(i.find("option")) : a.move(i), r.removeIfEmpty()
                        } else o.move(i)
                    }), c)
                },
                moveUp: function(t) {
                    var e = this;
                    return !("function" == typeof e.callbacks.beforeMoveUp && !e.callbacks.beforeMoveUp(t)) && (t.first().prev().before(t), void("function" == typeof e.callbacks.afterMoveUp && e.callbacks.afterMoveUp(t)))
                },
                moveDown: function(t) {
                    var e = this;
                    return !("function" == typeof e.callbacks.beforeMoveDown && !e.callbacks.beforeMoveDown(t)) && (t.last().next().after(t), void("function" == typeof e.callbacks.afterMoveDown && e.callbacks.afterMoveDown(t)))
                },
                undo: function(t) {
                    var e = this,
                        o = e.undoStack.pop();
                    if (o) switch (e.redoStack.push(o), o[0]) {
                        case "left":
                            e.moveToRight(o[1], t, !1, !0);
                            break;
                        case "right":
                            e.moveToLeft(o[1], t, !1, !0)
                    }
                },
                redo: function(t) {
                    var e = this,
                        o = e.redoStack.pop();
                    if (o) switch (e.undoStack.push(o), o[0]) {
                        case "left":
                            e.moveToLeft(o[1], t, !1, !0);
                            break;
                        case "right":
                            e.moveToRight(o[1], t, !1, !0)
                    }
                }
            }, e
        }(t);
        t.multiselect = {
            defaults: {
                startUp: function(e, o) {
                    o.find("option").each(function(o, n) {
                        if ("OPTGROUP" == t(n).parent().prop("tagName")) {
                            var i = 'optgroup[label="' + t(n).parent().attr("label") + '"]';
                            e.find(i + ' option[value="' + n.value + '"]').each(function(t, e) {
                                e.remove()
                            }), e.find(i).removeIfEmpty()
                        } else {
                            var r = e.find('option[value="' + n.value + '"]');
                            r.remove()
                        }
                    })
                },
                beforeMoveToRight: function(t, e, o) {
                    return !0
                },
                afterMoveToRight: function(t, e, o) {},
                beforeMoveToLeft: function(t, e, o) {
                    return !0
                },
                afterMoveToLeft: function(t, e, o) {},
                beforeMoveUp: function(t) {
                    return !0
                },
                afterMoveUp: function(t) {},
                beforeMoveDown: function(t) {
                    return !0
                },
                afterMoveDown: function(t) {},
                sort: function(t, e) {
                    return "NA" == t.innerHTML ? 1 : "NA" == e.innerHTML ? -1 : t.innerHTML > e.innerHTML ? 1 : -1
                },
                fireSearch: function(t) {
                    return t.length > 1
                }
            }
        };
        var o = window.navigator.userAgent,
            n = o.indexOf("MSIE ") + o.indexOf("Trident/") + o.indexOf("Edge/") > -3,
            i = o.toLowerCase().indexOf("safari") > -1;
        t.fn.multiselect = function(o) {
            return this.each(function() {
                var n = t(this),
                    i = n.data("crlcu.multiselect"),
                    r = t.extend({}, t.multiselect.defaults, n.data(), "object" == typeof o && o);
                i || n.data("crlcu.multiselect", i = new e(n, r))
            })
        }, t.fn.move = function(t) {
            return this.append(t).find("option").prop("selected", !1), this
        }, t.fn.removeIfEmpty = function() {
            return this.children().length || this.remove(), this
        }, t.fn.mShow = function() {
            return this.removeClass("hidden").show(), (n || i) && this.each(function(e, o) {
                t(o).parent().is("span") && t(o).parent().replaceWith(o), t(o).show()
            }), this
        }, t.fn.mHide = function() {
            return this.addClass("hidden").hide(), (n || i) && this.each(function(e, o) {
                t(o).parent().is("span") || t(o).wrap("<span>").hide()
            }), this
        }, t.fn.mSort = function(e) {
            return this.children().sort(e).appendTo(this), this.find("optgroup").each(function(o, n) {
                t(n).children().sort(e).appendTo(n)
            }), this
        }, t.fn.attachIndex = function() {
            this.children().each(function(e, o) {
                var n = t(o);
                n.is("optgroup") && n.children().each(function(e, o) {
                    t(o).data("position", e)
                }), n.data("position", e)
            })
        }, t.expr[":"].search = function(e, o, n) {
            var i = new RegExp(n[3], "i");
            return t(e).text().match(i)
        }
    });
function selectAll(){
    const name = [];
    for(var i = 0; i < document.getElementById("undo_redo_to").options.length; i++){
        name.push(document.getElementById("undo_redo_to").options[i]);
    }
    return name;
}