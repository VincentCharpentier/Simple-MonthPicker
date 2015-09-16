"use strict";
// No args for now
$.fn.Monthpicker = function(args, extraArgs) {
	function isInt(value) {
		return !isNaN(value) && 
         parseInt(Number(value)) == value && 
         !isNaN(parseInt(value, 10));
	}
	// return the year corrected if needed
	function checkYear(monthpicker,value) {
		var opts = monthpicker.data("opts");
		var yearField = monthpicker.find(".yearValue");
		value = (""+value).trim();
		if (!isInt(value)) {
			if (isInt(yearField.data("prev"))) {
				return yearField.data("prev");
			} else {
				return checkYear(monthpicker,(new Date()).getFullYear());
			}
		} else {
			if (opts.minYear && value < opts.minYear) {
				return opts.minYear;
			} else if (opts.maxYear && value > opts.maxYear) {
				return opts.maxYear;
			}
			return value;
		}
	}
	function setYear(monthpicker, value) {
		var opts = monthpicker.data("opts");
		var newValue = checkYear(monthpicker, value);
		monthpicker.find(".yearValue").val(newValue);
		monthpicker.find(".yearSwitch").css("visibility","visible");
		if (opts.minYear && newValue <= opts.minYear) {
			monthpicker.find(".yearSwitch.down").css("visibility","hidden");
		}
		if (opts.maxYear && newValue >= opts.maxYear) {
			monthpicker.find(".yearSwitch.up").css("visibility","hidden");
		}
		drawBounds(monthpicker);
	}
	function drawBounds(monthpicker) {
		var opts = monthpicker.data("opts");
		var year = monthpicker.find(".yearValue").val();
		monthpicker.find(".monthpicker_selector>table .month").removeClass("off");
		if (opts.minValue) {
			var parts = opts.minValue.split('/');
			if (parts[1] == year) {
				for (var i = 1; i < parseInt(parts[0],10); i++) {
					monthpicker.find(".monthpicker_selector>table .month"+(i-1)).addClass("off");
				}
			}
		}
		if (opts.maxValue) {
			var parts = opts.maxValue.split('/');
			if (parts[1] == year) {
				for (var i = 12; i > parseInt(parts[0],10); i--) {
					monthpicker.find(".monthpicker_selector>table .month"+(i-1)).addClass("off");
				}
			}
		}
	}
	function reinit(monthpicker) {
		// reinit all
		monthpicker.find("input").val("");
		monthpicker.find(".monthpicker_input").addClass("clear").text("Pick up a month");
		setYear(monthpicker,null);
	}
	function checkConsistencyMin(monthpicker) {
		// minValue & minYear
		var opts = monthpicker.data("opts");
		if (opts.minValue) {
			if (!(""+opts.minValue).match(/\d{2}\/\d{4}/)) {
				console.error("minValue : argument should be in mm/yyyy format.");
				return;
			} else {
				var parts = opts.minValue.split('/');
				var month = parseInt(parts[0],10);
				if (month < 1 || month > 12) {
					console.error("minValue : month should be a value between 1 and 12");
					return;
				}
				if (month < 10) {
					// format standard
					opts.minValue = '0' + month + '/' + parts[1];
				}
			}
		}
		if (opts.minYear && opts.minValue) {
			var parts = opts.minValue.split('/');
			if (parseInt(opts.minYear,10) <= parseInt(parts[1],10)) {
				opts.minYear = parseInt(parts[1],10);
			} else {
				opts.minValue = "01/" + opts.minYear;
			}
		} else if (opts.minYear && !opts.minValue) {
			opts.minValue = "01/" + opts.minYear;
		} else if (!opts.minYear && opts.minValue) {
			opts.minYear = parseInt(opts.minValue.split('/')[1],10);
		}
		monthpicker.data("opts",opts);
	}
	function checkConsistencyMax(monthpicker) {
		// maxValue & maxYear
		var opts = monthpicker.data("opts");
		if (opts.maxValue) {
			if (!(""+opts.maxValue).match(/\d{2}\/\d{4}/)) {
				console.error("maxValue : argument should be in mm/yyyy format.");
				return;
			} else {
				var parts = opts.maxValue.split('/');
				var month = parseInt(parts[0],10);
				if (month < 1 || month > 12) {
					console.error("maxValue : month should be a value between 1 and 12");
					return;
				}
				if (month < 10) {
					// format standard
					opts.maxValue = '0' + month + '/' + parts[1];
				}
			}
		}
		if (opts.maxYear && opts.maxValue) {
			var parts = opts.maxValue.split('/');
			if (parseInt(opts.maxYear,10) >= parseInt(parts[1],10)) {
				opts.maxYear = parseInt(parts[1],10);
			} else {
				opts.maxValue = "12/" + opts.maxYear;
			}
		} else if (opts.maxYear && !opts.maxValue) {
			opts.maxValue = "12/" + opts.maxYear;
		} else if (!opts.maxYear && opts.maxValue) {
			opts.maxYear = parseInt(opts.maxValue.split('/')[1],10);
		}
		monthpicker.data("opts",opts);
	}

	// ---------------------------------------------------------------------------
	//                          CONTROLE DES ARGUMENTS
	var mode;
	if (typeof(args) === "undefined" || typeof(args) === "object") {
		mode = "ctor";
	} else if (typeof(args) === "string") {
		mode = "action";
	} else {
		console.error("Error : Monthpicker - bad argument (1)");
		return;
	}

	var opts;
	if (mode == "ctor") {
		if (args) {
			if (args.minYear && !isInt(args.minYear)) {
				delete args.minYear;
			} else {
				args.minYear = parseInt(args.minYear);
			}
			if (args.maxYear && !isInt(args.maxYear)) {
				delete args.maxYear;
			} else {
				args.maxYear = parseInt(args.maxYear);
			}
			opts = $.extend({},$.fn.Monthpicker.opts,args);
		} else {
			opts = $.extend({},$.fn.Monthpicker.opts);
		}
	}
	// ---------------------------------------------------------------------------

	$(this).each(function(i, item) {
		switch (mode) {
			case "ctor":
				if (item.tagName.toLowerCase() === "input" && item.type && item.type.toLowerCase() === "text") {
					var original_input = $(item);
					var width = original_input.outerWidth();
					var height = original_input.outerHeight();
					original_input.hide();
					var initial_id = item.id;
					var id_str = "";
					if (typeof(initial_id) === "string" && initial_id !== "") {
						id_str = "id='"+initial_id+"_mthPck' ";
					}
					original_input.wrap("<div "+id_str+"class='monthpicker' tabindex='-1' style='width:"+width+"px;height:"+height+"px'>&nbsp;</div>")
					var monthpicker = original_input.parent(".monthpicker");
					monthpicker.data("opts",opts);
					// -----------------------------------------------------------
					//            CONTROLE DES ARGUMENTS CONSTRUCTEUR
					checkConsistencyMin(monthpicker);
					checkConsistencyMax(monthpicker);
					// -----------------------------------------------------------
					// SHOW / HIDE
					monthpicker.on("mpck_show", function() {
						if (!$(this).hasClass("visible")) {
							$(this).addClass("visible");
							$(this).find(".monthpicker_selector").stop().slideDown();
						}
					});
					monthpicker.on("mpck_select", function() {
						monthpicker.data("opts").onSelect();
					});
					monthpicker.on("mpck_hide", function() {
						if ($(this).hasClass("visible")) {
							$(this).removeClass("visible");
							$(this).find(".monthpicker_selector").stop().slideUp();
							monthpicker.data("opts").onClose();
						}
					});
					monthpicker.focusin(function() {
						$(this).trigger("mpck_show");
					}).focusout(function() {
						$(this).trigger("mpck_hide");
					});
					// add UI Elements
					monthpicker.append(
						"<div type='text' class='monthpicker_input'></div>"
						+ "<div class='monthpicker_selector' style='display:none;'><table><tr><td><span class='yearSwitch down'>&lt;</span></td><td><input class='yearValue' type='text' placeholder='Year'></td><td><span class='yearSwitch up'>&gt;</span></td></tr></table></div>");
					reinit(monthpicker);
					var visible_input = monthpicker.find(".monthpicker_input");
					// VISIBLE INPUT
					visible_input.click(function() {
						$(this).trigger("mpck_show");
					})
					// YEAR TEXT AREA
					monthpicker.find(".yearValue").focusin(function() {
						$(this).data("prev",$(this).val());
						$(this).val("");
					})
					.focusout(function() {
						setYear(monthpicker, $(this).val());
					})
					.keyup(function(event) {
						if(event.which === 13) {// ENTER
							$(this).blur(); // leave focus
							monthpicker.focusin(); // stay open
						}
					});
					monthpicker.find(".yearValue").trigger("focusout"); // init
					// YEAR SWITCHES
					monthpicker.find(".yearSwitch.down").click(function() {
						var newValue = parseInt(monthpicker.find(".yearValue").val()) - 1;
						setYear(monthpicker, newValue);
					});
					monthpicker.find(".yearSwitch.up").click(function() {
						var newValue = parseInt(monthpicker.find(".yearValue").val()) + 1;
						setYear(monthpicker, newValue);
					});
					// MONTHS AREA
					var selector_str = "";
					for (var j = 0; j < 4; j++) {
						var idx = j*3;
						var months = opts.monthLabels.slice(idx, idx+3);
						selector_str += "<tr><td class='month month"+idx+"' data-m='"+idx+"'>"+months[0]
						+"</td><td class='month month"+(idx+1)+"' data-m='"+(idx+1)+"'>"+months[1]
						+"</td><td class='month month"+(idx+2)+"' data-m='"+(idx+2)+"'>"+months[2]+"</td></tr>";;
					}
					monthpicker.find(".monthpicker_selector>table").append(selector_str);
					// MONTH BEHAV.
					monthpicker.find(".monthpicker_selector>table tr:not(:first-child) td").click(function() {
						if ($(this).hasClass("off")) {
							return;
						}
						var month = $(this).data("m") + 1;
						var month_fullNum = "" + month;
						if (parseInt(month) < 10) {
							month_fullNum = "0" + month;
						}
						var year = monthpicker.find(".yearValue").val();
						original_input.val(month_fullNum + "/" + year);
						var month_label = opts.monthLabels[month-1];
						visible_input.removeClass("clear").text(month_label + " " + year);
						$(this).trigger("mpck_select");
						$(this).trigger("mpck_hide");
					});
					drawBounds(monthpicker);
					original_input.addClass("mpck_init");
				}
				break;
			case "action":
				if ($(item).hasClass("mpck_init")) {
					var monthpicker = $(item).parent(".monthpicker");
					var action = args;
					switch(action) {
						case "option":
							opts = $.extend({},monthpicker.data("opts"),extraArgs);
							monthpicker.data("opts",opts);
							if (extraArgs.minYear || extraArgs.maxYear || extraArgs.minValue || extraArgs.maxValue) {
								if (extraArgs.minValue && !extraArgs.minYear) {
									opts.minYear = null;
								} else if (!extraArgs.minValue && extraArgs.minYear) {
									opts.minValue = null;
								}
								if (extraArgs.maxValue && !extraArgs.maxYear) {
									opts.maxYear = null;
								} else if (!extraArgs.maxValue && extraArgs.maxYear) {
									opts.maxValue = null;
								}
								monthpicker.data("opts",opts);
								checkConsistencyMin(monthpicker);
								checkConsistencyMax(monthpicker);
								// verifier existant
								var currentValue = parseInt(monthpicker.find(".yearValue").val(),10);
								var newValue = parseInt(checkYear(monthpicker, currentValue),10);
								if (newValue !== currentValue) {
									reinit(monthpicker);
								}
								drawBounds(monthpicker);
							}
							break;
						default:
							console.error("Error: Monthpicker - Unknown action \""+action+"\"");
							break;
					}
				}
				break;
		}
		
	});
}

$.fn.Monthpicker.opts = {
	// UI
	monthLabels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jui", "Aug", "Sep", "Oct", "Nov", "Dec"],
	// BOUNDS
	minYear: null,
	maxYear: null,
	minValue: null,
	maxValue: null,
	// EVENTS
	onSelect: function() { return; },
	onClose: function() { return; }
};