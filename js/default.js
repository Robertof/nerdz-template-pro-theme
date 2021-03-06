$(document).ready(function() {
    var loading = N.getLangData().LOADING;
    $("iframe").attr('scrolling','no');
    $("body").append($('<br />'));
    // append version information
    if ($("#left_col").length && typeof Nversion !== 'undefined' && Nversion != 'null')
        $("#left_col .title").eq (0).append (" <span class='small' style='font-weight: normal'><a href='https://github.com/nerdzeu/nerdz.eu/commit/" + Nversion + "' target='wowsoversion' style='color: #000 !important'>[" + Nversion + "]</a></span>").find ('a').css ('vertical-align', 'middle');
    // load the prettyprinter
    var append_theme = "skin=sons-of-obsidian&", _h = $("head");
    if (localStorage.getItem ("has-light-theme") == 'yep')
        append_theme = "";
    var prettify = document.createElement ("script");
    prettify.type = "text/javascript";
    prettify.src  = '//cdnjs.cloudflare.com/ajax/libs/prettify/r298/run_prettify.js?' + append_theme + 'callback=pt_onPrettyPrint';
    _h.append (prettify);
    if (append_theme !== '')
        _h.append ('<style type="text/css">.nerdz-code-wrapper { background-color: #000; color: #FFF; }</style>');
    else
        _h.append ('<style type="text/css">.nerdz-code-wrapper { background-color: #FFF; color: #000; }</style>');
    if (typeof window.exports !== 'object')
        window.exports = {};
    window['pt_onPrettyPrint'] = window.exports['pt_onPrettyPrint'] = function() {
        // apply our fixes to the [code] tag output
        $(".nerdz-code-wrapper:not(.pt-processed)").each (function() {
            var me = $(this), textVersion = me.find ("a");
            me.addClass ("pt-processed");
            if (textVersion.length)
            {
                textVersion
                    .remove()
                    .addClass ("nerdz-code-text-version")
                    .click (function (e) { e.stopPropagation(); })
                    .appendTo (me.find (".nerdz-code-title"));
            }
        });
    };
    
    $("#notifycounter").on('click',function(e) {
        e.preventDefault();
        var list = $("#notify_list"), old = $(this).html();
        var nold = parseInt(old);
        if(list.length) {
            if(isNaN(nold) || nold === 0)
            {
                list.remove();
            }
            else if(nold > 0) {
                list.prepend('<div id="pr_lo">'+loading+'</div>');
                N.html.getNotifications(function(d) {
                    $("#pr_lo").remove();
                    list.prepend(d);
                 });
            }
        }
        else {
            var l = $(document.createElement("div"));
            l.attr('id',"notify_list");
            l.html(loading);
            $("body").append(l);
            N.html.getNotifications(function(d) {
                l.html(d);
            });
    
            $("#notify_list").on('click','.notref',function(e) {
                if (e.ctrlKey) return;
                e.preventDefault();
                var href = $(this).attr('href');
                if(href == window.location.pathname + window.location.hash) {
                    location.reload();
                }
                else {
                    location.href = href;
                }
            });

        }
        $(this).html(isNaN(nold) ? old : '0');
    });

    /* il footersearch si mostra solo in alcune pagine */
    var wrongPages = [ '/bbcode.php','/terms.php','/faq.php','/stats.php','/rank.php','/preferences.php', '/informations.php', '/preview.php' ];
    if ($.inArray (location.pathname, wrongPages) !== -1)
        $("#footersearch").hide();

    $("#footersearch").on('submit',function(e) {
        e.preventDefault();
        var plist = $("#postlist");
        var qs =  $.trim($("#footersearch input[name=q]").val());
        var num = 10; //TODO: numero di posts, parametro?

        if(qs === '')
            return false;
        else if (qs === '$W4G')
        {
            // Time for some swaggy_156
            // (totally not an easter egg)
            var swaggy_156 = 'https://i.imgur.com/K0Clckb.jpg';
            $("#left_col, #right_col").css ({
                backgroundImage: "url('" + swaggy_156 + "')",
                backgroundPosition: "-300px -300px"
            });
            $("img[onload^=N]").attr ("src", swaggy_156);
            $("#title_left a").html ("NERDZ <small>swag edition</small>");
            $(".nerdz_from a").html ("swaggy_156");
            $(".nerdz_message div").eq (0).html ('<iframe width="1280" height="720" src="//www.youtube.com/embed/dtK4KMGabws?rel=0&autoplay=1" frameborder="0" allowfullscreen></iframe>');
            $("textarea").prop ("disabled", true).val (new Array (300).join ("SWAG "));
            document.title = "SWAG";
            setTimeout (function() {
                $("#center_col").html ("SWAG LEVEL EXCEEDED").css ({ fontSize: "50px", textAlign: "center", color: "red" });
                setTimeout (function() {
                    document.location.reload();
                }, 1000);
            }, 10000);
            return;
        }

        var manageResponse = function(d)
        {
            plist.html(d);
            sessionStorage.setItem('searchLoad', "1");
        };

        if(plist.data('type') == 'project')
        {
            if(plist.data('location') == 'home')
            {
                N.html.search.globalProjectPosts(num, qs, manageResponse);
            }
            else
            {
                if(plist.data('location') == 'project')
                {
                    N.html.search.specificProjectPosts(num, qs, plist.data('projectid'),manageResponse);
                }
            }
        }
        else
        {
            if(plist.data('location') == 'home')
            {
                N.html.search.globalProfilePosts(num, qs, manageResponse);
            }
            else
            {
                if(plist.data('location') == 'profile')
                {
                    N.html.search.specificProfilePosts(num, qs, plist.data('profileid'),manageResponse);
                }
            }
        }
        plist.data('mode','search');
    });

    $("#logout").on('click',function(event) {
        event.preventDefault();
        var t = $("#title_right");
        N.json.logout( { tok: $(this).data('tok') }, function(r) {
            var tmp = t.html();
            if(r.status == 'ok')
            {
                t.html(r.message);
                setTimeout(function() {
                    document.location.href = "/";
                    },1500);
            }
            else
            {
                t.html('<h2>'+ r.message + '</h2>');
                setTimeout(function() {
                    t.html(tmp);
                },1500);
            }
        });
    });

    $("#gotopm").on('click',function(e) {
        e.preventDefault();
        var href = $(this).attr('href');
        if($('#pmcounter').html() != '0') {
            if(href == window.location.pathname ) {
                location.hash = "new";
                location.reload();
            }
            else {
                location.href='/pm.php#new';
            }
        }
        else
        {
            location.href = href;
        }
    });

    $("#regfrm").on('submit',function(event) {
        event.preventDefault();
        N.json.register($("#regfrm").serialize(),function(obj) {
            
            if(obj.status == 'error')
            {
                $("#error").html(obj.message.replace(/\n/g,"<br />"));
                $("#cptxt").html('');
                N.reloadCaptcha();
            }
            else if(obj.status == 'ok')
            {
                $("#error").hide();
                $("#done").html(obj.message);
                setTimeout(function() {
                    window.location.reload();
                }, 1500);
            }
        });
    });

    $(".post-control-preview").on('click',function(){
        var $me = $(this);
        setTimeout (function() {
            var txt = $($me.data('refto')).val();
            if (txt)
                window.open ('/preview.php?message='+encodeURIComponent (txt + " "));
        }, 0);
    });
    
    $("textarea").on('keydown', function(e) {
        if( e.ctrlKey && (e.keyCode == 10 || e.keyCode == 13) ) {
            $(this).parent().trigger('submit');
        }
    });

    // handle events on the post list
    var plist = $("#postlist");

    plist.on('click', ".yt_frame", function(e) {
        e.preventDefault();
        N.yt($(this), $(this).data("vid"));
    });

    plist.on('click','.post-control-preview',function(){
        var $me = $(this);
        setTimeout (function() {
            var txtarea = $($me.data('refto'));
            txtarea.val(txtarea.val()+' '); //workaround
            var txt = txtarea.val();
            txtarea.val($.trim(txtarea.val()));
            if ($.trim(txt) !== '')
                window.open('/preview.php?message='+encodeURIComponent(txt));
        }, 0);
    });

    plist.on('keydown',"textarea", function(e) {
        if( e.ctrlKey && (e.keyCode == 10 || e.keyCode == 13) ) {
            $(this).parent().trigger('submit');
        }
    });

    plist.on('click',".delcomment",function() {
        var me = $(this);
        if (!me.hasClass ("delcomment-such-transform")) // confirm the deletion
        {
            me.addClass ("delcomment-such-transform");
            return;
        }
        var refto = $('#' + me.data('refto'));
        refto.html (loading + '...');
        N.json[plist.data('type')].delComment ({ hcid: me.data('hcid') }, function(d) {
            if (d.status == 'ok')
                refto.slideUp ("slow", function() {
                    refto.remove();
                });
            else
                refto.html(d.message);
        });
    });

    plist.on('submit','.frmcomment',function(e) {
        e.preventDefault();
        var $me = $(this);
        setTimeout (function() {
            var last, hcid,
                hpid     = $me.data ('hpid'),
                refto    = $('#commentlist' + hpid),
                error    = $me.find ('.error').eq (0),
                pattern  = 'div[id^="c"]',
                comments = refto.find (pattern);
            if(comments.length)
            {
                // Uses the second-last element instead of the last one (if available)
                // to fix the append bug reported by nessuno.
                last = comments.length > 1 ? comments.eq (comments.length - 2) : null;
                hcid = last ? last.data('hcid') : 0;
            }
            error.html (loading);
            N.json[plist.data('type')].addComment ({ hpid: hpid, message: $me.find('textarea').eq(0).val() }, function(d) {
                if(d.status == 'ok')
                {
                    if(hcid && last)
                    {
                        N.html[plist.data('type')].getCommentsAfterHcid ({ hpid: hpid, hcid: hcid }, function(d) {
                            var form = refto.find ('form.frmcomment').eq (0),
                                pushBefore = form.parent(),
                                newComments = $('<div>' + d + '</div>').find (pattern),
                                internalLengthPointer = comments.length,
                                lastComment = comments.last();
                            // if available, delete the secondlast comment
                            if (comments.length > 1) {
                                comments.eq (comments.length - 1).remove();
                                internalLengthPointer--;
                            }
                            // then, check the hcid of the last comment
                            // delete it if it matches
                            if (lastComment.data ('hcid') == newComments.last().data ('hcid')) {
                                lastComment.remove();
                                internalLengthPointer--;
                            }
                            // wait until we reach 10 comments (except if the user pressed more)
                            // TODO: replace this with comments.slice (0, n).remove()
                            // TODO: add logic to show again the 'more' button if we deleted
                            // enough comments
                            // Fix for issue #9: add a >point<
                            while ((internalLengthPointer + newComments.length) > (((comments.parent().find ('.more_btn').data ('morecount') || 0) + 1) * 10)) {
                                comments.first().remove();
                                // reassign the variable, otherwise .first() won't work
                                // anymore with .remove().
                                comments = refto.find (pattern);
                                internalLengthPointer--;
                            }
                            // append newComments
                            pushBefore.before (d);
                            form.find ('textarea').val ('');
                            error.html('');
                        });
                    }
                    else
                    {
                        N.html[plist.data('type')].getComments( { hpid: hpid, start: 0, num: 10 },function(d) {
                            refto.html(d);
                            error.html('');
                        });
                    }
                }
                else
                {
                    error.html(d.message);
                }
            });
        }, 0);
    });

    plist.on('click',".showcomments",function() {
        var $refto = $('#' + $(this).data('refto'));
        if ($refto.html() === '')
        {
            $refto.html(loading+'...');
            N.html[plist.data ('type')].getComments ({
                hpid: $(this).data ('hpid'),
                start: 0,
                num: 10
            }, function (res) {
                $refto.html (res);
                if (document.location.hash == '#last')
                    $refto.find ('.frmcomment textarea[name=message]').focus();
                else if (/^#c\d+/.test (document.location.hash))
                {
                    var such_cb = function() {
                            var $new_comment = $(document.location.hash);
                            if ($new_comment.length > 0)
                            {
                                $new_comment.find (".nerdz_comments").css ("background-color", "lightyellow");
                                $(document).scrollTop ($new_comment.offset().top);
                            }
                        };
                    if ($(document.location.hash).length < 1)
                    {
                        var $final_elements =
                            [ $refto.find (".all_comments_btn"), $refto.find (".more_btn") ]
                            .filter (function ($elm) { return $elm.is (":visible"); });
                        if ($final_elements.length > 0)
                            $final_elements.shift().trigger ("click", such_cb);
                    }
                    else
                        such_cb();
                }
            });
        }
        else
            $refto.html('');
    });

    plist.on('click', ".vote", function() {
        var curr = $(this),
          cont = curr.parent(),
          tnum = cont.parent().children(".thumbs-counter"),
          func = "thumbs",
          obj = { hpid: cont.data("refto") };

        if(cont.hasClass("comment"))  {
            obj = { hcid: cont.data("refto") };
            func = "cthumbs";
        }
          
        if(curr.hasClass("voted")) { 
            N.json[plist.data ('type')][func]($.extend(obj,{thumb: 0}), function(r) {
                curr.removeClass("voted");
                var votes = parseInt(r.message);
                tnum.attr("class","thumbs-counter").text(votes);
                if(votes !== 0) {
                    tnum.addClass(votes>0?"nerdz_thumbsNumPos":"nerdz_thumbsNumNeg");
                }
                if(votes>0) {
                    tnum.text("+"+tnum.text());
                }
              });
        }
        else {
            N.json[plist.data ('type')][func]($.extend(obj,{ thumb: curr.hasClass("up") ? 1: -1 }), function(r) {
                cont.children(".voted").removeClass("voted");
                curr.addClass("voted");
                var votes = parseInt(r.message);
                tnum.attr("class","thumbs-counter").text(votes);
                if(votes !== 0) {
                    tnum.addClass(votes>0?"nerdz_thumbsNumPos":"nerdz_thumbsNumNeg");
                }
                if(votes>0) {
                    tnum.text("+"+tnum.text());
                }
             });
        }
    });
    

    plist.on ('click', '.more_btn', function (evt, cb) {
        var moreBtn     = $(this),
            commentList = moreBtn.parents ("div[id^=\"commentlist\"]"),
            hpid        = /^post(\d+)$/.exec (commentList.parents ("div[id^=\"post\"]").attr ("id"))[1],
            intCounter  = moreBtn.data ("morecount") || 0;
        if (moreBtn.data ("inprogress") === "1") return;
        moreBtn.data ("inprogress", "1").text (loading + "...");
        N.html[plist.data ('type')].getComments ({ hpid: hpid, start: intCounter + 1, num: 10 }, function (r) {
            moreBtn.data ("inprogress", "0").data ("morecount", ++intCounter).text (moreBtn.data ("localization"));
            var _ref = $("<div>" + r + "</div>");
            // Lesson learned: don't use .parent() after a .hide()
            moreBtn.parent().after (r);
            if (intCounter == 1)
                moreBtn.parent().find (".scroll_bottom_hidden").show();
            if ($.trim (r) === '' || _ref.find (".nerdz_from").length < 10 || (10 * (intCounter + 1)) == _ref.find (".commentcount:eq(0)").html())
            {
                var btnDb = moreBtn.hide().parent();
                btnDb.find (".scroll_bottom_separator").hide();
                btnDb.find (".all_comments_hidden").hide();
            }
            if (typeof cb === 'function') cb();
        });
    });

    plist.on ('click', '.scroll_bottom_btn', function() {
        // thanks to stackoverflow for .eq(x) and for the scroll hack
        var cList = $(this).parents().eq (2);
        // Select the second last comment, do a fancy scrolling and then focus the textbox.
        $("html, body").animate ({ scrollTop: cList.find (".singlecomment:nth-last-child(2)").offset().top }, function() {
            cList.find (".frmcomment textarea").focus();
        });
    });

    plist.on ('click', '.all_comments_btn', function (evt, cb) {
        // TODO do not waste precious performance by requesting EVERY
        // comment, but instead adapt the limited function to allow
        // specifying a start parameter without 'num'.
        var btn         = $(this),
            btnDb       = btn.parent().parent(),
            moreBtn     = btnDb.find (".more_btn"),
            commentList = btn.parents ("div[id^=\"commentlist\"]"),
            hpid        = /^post(\d+)$/.exec (commentList.parents ("div[id^=\"post\"]").attr ("id"))[1];
        if (btn.data ("working") === "1" || moreBtn.data ("inprogress") === "1") return;
        btn.data ("working", "1").text (loading + "...");
        moreBtn.data ("inprogress", "1");
        N.html[plist.data ('type')].getComments ({ hpid: hpid, forceNoForm: true }, function (res) {
            btn.data ("working", "0").text (btn.data ("localization")).parent().hide();
            btnDb.find (".scroll_bottom_hidden").show().find (".scroll_bottom_separator").hide();
            var parsed = $("<div>" + res + "</div>"), push = $("#commentlist" + hpid);
            moreBtn.hide().data ("morecount", Math.ceil (parseInt (parsed.find (".commentcount").html()) / 10));
            push.find ("div[id^=\"c\"]").remove();
            push.find ('form.frmcomment').eq (0).parent().before (res);
            if (typeof cb === 'function') cb();
        });
    });

    plist.on('click',".qu_ico",function() {
        var area = $("#" + $(this).data ('refto')),
            msg  = "[quote=" + $(this).data ('hcid') + "|" + $(this).data ('type') + "]",
            cpos = area[0].selectionStart,
            val  = area.val(),
            intx = val.substring (0, cpos) + msg;
        area.focus();
        area.val (intx + val.substring (cpos));
        area[0].setSelectionRange (intx.length, intx.length);
    });

    plist.on('click',".delpost",function(e) {
        e.preventDefault();
        var refto = $('#' + $(this).data('refto'));
        var post = refto.html();
        var hpid = $(this).data('hpid');

        N.json[plist.data('type')].delPostConfirm({ hpid: hpid },function(m) {
            if (m.status == 'ok')
            {
                refto.html('<div style="text-align:center">' + m.message + '<br /><span id="delPostOk' + hpid +'" style="cursor:pointer">YES</span>|<span id="delPostNo'+hpid+'" style="cursor:pointer">NO</span></div>');
                refto.on('click','#delPostOk'+hpid,function() {
                    N.json[plist.data('type')].delPost ({ hpid: hpid }, function(j) {
                        if(j.status == 'ok')
                            refto.hide();
                        else
                            refto.html(j.message);
                    });
                });
                refto.on('click','#delPostNo'+hpid,function() {
                    refto.html(post);
                });
            }
        });
    });

    plist.on('click',".editpost", function(e) {
        e.preventDefault();
        var $this        = $(this),
            editBtnLabel = $this.attr ("title"),
            hpid         = $this.data ("hpid"),
            $post        = $("#" + $this.data ("refto")),
            formFieldId  = $post.attr ("id") + "-textarea";
        N.json[plist.data ("type")].getPost ({ hpid: hpid }, function (d) {
            $post.html ("");
            // generate the edit form (the proper way)
            $(document.createElement ("form")).data ("hpid", hpid).append (
                $(document.createElement ("textarea"))
                    .attr ("id", formFieldId)
                    .prop ("autofocus", true)
                    .addClass ("bbcode-enabled post-control-textarea bigger")
                    .html (d.message), // required instead of .val() otherwise things explode
                $(document.createElement ("input"))
                    .attr ("type", "submit")
                    .addClass ("post-control-submit")
                    .val (editBtnLabel),
                $(document.createElement ("button"))
                    .attr ("type", "button")
                    .addClass ("post-control-preview")
                    .data ("refto", "#" + formFieldId)
                    .html ($(".post-control-preview").html()),
                $(document.createElement ("button"))
                    .attr ("type", "button")
                    .addClass ("post-control-bbcode")
                    .html ("BBCode")
                    .on ("click", function() { window.open ("/bbcode.php") })
            ).on ("submit", function (evt) {
                evt.preventDefault();
                var $this = $(this);
                setTimeout (function() {
                    N.json[plist.data ("type")].editPost ({
                        hpid:    $this.data ("hpid"),
                        message: $this.find ("textarea").val()
                    }, function (res) {
                        if (res.status !== "ok")
                            return alert (res.message);
                        $post.hide();
                        N.html[plist.data ("type")].getPost ({
                            hpid: $this.data ("hpid")
                        }, function (nPost) {
                            $post.html (nPost).slideToggle ("slow");
                            if (!$post.data ("hide")) return;
                            $post.find (".post-icon-holder").removeClass ("unspacer").append (
                                $(document.createElement ("a"))
                                    .addClass ("hide fa fa-ban")
                                    .data ("postid", "post" + $this.data ("hpid"))
                                    .attr ("title", $post.data ("hide"))
                            );
                        })
                    })
                })
            }).css ("margin-bottom", "40px").appendTo ($post);
        });
    });
    var toggle_controls = [
        {
            on: {
                ".imglocked":   "reNotify",
                ".imgunlocked": "noNotify"
            },
            classes: "fa-lock fa-unlock-alt imglocked imgunlocked",
            handler: function (context, funcName, callback) {
                var $this = $(this), obj = { hpid: $this.data ("hpid") };
                if ($this.data ("silent"))
                    context[funcName + "FromUserInPost"]($.extend ({}, obj, { from: $this.data ("silent") }), callback);
                else
                    context[funcName + "ForThisPost"](obj, callback);
            }
        },
        {
            on: {
                ".lurk":   "lurkPost",
                ".unlurk": "unlurkPost"
            },
            classes: "fa-eye fa-eye-slash lurk unlurk"
        },
        {
            on: {
                ".bookmark":   "bookmarkPost",
                ".unbookmark": "unbookmarkPost"
            },
            classes: "fa-star fa-star-o bookmark unbookmark"
        }
    ], find_toggle = function (query) {
        for (var i = 0; i < toggle_controls.length; i++)
            if (query in toggle_controls[i].on)
                return toggle_controls[i];
        throw "can't find " + query + " in toggle_controls";
    };
    for (var x = 0; x < toggle_controls.length; x++)
    {
        // no need for .hasOwnProperty :>
        for (var selector in toggle_controls[x].on)
            plist.on ("click", selector, function (e) {
                var elm = this, toggle = find_toggle (e.handleObj.selector);
                if (!("handler" in toggle))
                    toggle.handler = function (context, funcName, callback) {
                        context[funcName]({ hpid: $(this).data ("hpid") }, callback);
                    };
                toggle.handler.call (elm, N.json[plist.data ("type")], toggle.on[e.handleObj.selector], function (d) {
                    if (d.status === "ok")
                        $(elm).attr ("title", d.message).toggleClass (toggle.classes);
                    else
                        alert (d.message);
                });
            });
    }

    plist.on ('click', '.nerdz-code-title', function() {
        localStorage.setItem ('has-light-theme', ( localStorage.getItem ('has-light-theme') == 'yep' ? 'nope' : 'yep' ));
        document.location.reload();
    });

    // EASTER EGG! :O
    // NOTE: If you alreay tried/discovered this easter egg, then feel free
    // to read the code. Otherwise don't be a bad guy and try to find it by yourself.
    if($("nav div").length) {
        var code = [ 38, 38, 40, 40, 37, 39, 37, 39, 66, 65 ], pressed = [];
        var nick  = /,(.+)/.exec ($("nav div").text());
        window._NERDZ_NICK = (nick != null) && typeof nick[1] != "undefined" ? $.trim(nick[1]) : 'You n00b';
        $(window).keydown (function dEv (e) {
            pressed.push (e.keyCode);
            while (pressed.length > code.length) pressed.shift();
            if (JSON.stringify (code) == JSON.stringify (pressed))
            {
                $(window).unbind ('keydown', dEv);
                $('body, a, textarea, input, button').css ('cursor', 'url("http://www.nerdz.eu/static/images/owned.cur"), auto');
                // okay, now the user sees a nice dick instead of its cursor. Why not
                // improve this situation a bit, like changing every nickname with random l4m0rz nicks?
                var fuckNicknames = function() {
                    $(".nerdz_from a").each (function (i, elm) {
                        if ($.inArray ($(elm).html(), ["Vincenzo", "Xenom0rph", "jorgelorenzo97", "PTKDev"]) === -1)
                            $(elm).html (["Vincenzo", "Xenom0rph", "jorgelorenzo97", "PTKDev"][Math.floor(Math.random() * 5)]);
                    });
                };
                // hook a global ajax event handler to destroy nicknames if needed
                $(document).ajaxComplete (function (evt, xhr, settings) {
                    if (/\?action=(show|profile)$|read\.html/.test (settings.url))
                        fuckNicknames();
                });
                fuckNicknames();
                // we're good to go. now do some other things
                $("#title_left a").text ("L4M3RZ");
                setTimeout (function() {
                    $("aside").hide();
                    setTimeout (function() {
                        $("article").hide();
                        $("#loadtxt").css ("text-align", "center").html ("Javascript error: Query #" + parseInt (1 + (Math.floor (Math.random() * 1000))) + " failed.<br><span style='color:#F80012;font-size:20px'>!! JS SQL Injection Detected. Shutting down !!</span>");
                        setTimeout (function() {
                            // enough fun, time for serious stuff
                            $("body").load ("/bsod.html", function() {
                                document.title = "!! SOMETHING F**KED UP !!";
                                $("*").css ("cursor", "none");
                            });
                        }, 5000);
                    }, 9500);
                }, 10500);
            }
        });
    }
    // subscribe to the notification events to change the color of the notifycounter and pmcounter
    var $notifycounter = $("#notifycounter"), $pmcounter = $("#pmcounter");
    $(document)
        .on ("nerdz:notification", function (e, count) {
            $notifycounter.css ("background-color", count > 0 ? "#FF0000" : "#FFF");
        })
        .on ("nerdz:pm", function (e, count) {
            $pmcounter.css ("background-color", count > 0 ? "#FF0000" : "#AFAFAF");
        });
});
