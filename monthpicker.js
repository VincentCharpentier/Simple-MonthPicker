var Monthpicker = (function () {
    function Monthpicker(element, opts) {
        this.currentYear = null;
        this.selectedYear = null;
        this.selectedMonth = null;
        this.id = Monthpicker.next_id++;
        Monthpicker.instances[this.id] = this;
        this.original_input = element;
        this.InitOptions(opts);
        this.InitValue();
        this.Init();
        this.RefreshInputs();
    }
    Monthpicker.Get = function (element) {
        if (typeof (element.parentElement.dataset['mp']) === "undefined") {
            throw "Unable to retrieve the Monthpicker of element " + element;
        }
        return Monthpicker.instances[element.parentElement.dataset['mp']];
    };
    Monthpicker.prototype.InitValue = function () {
        var d = new Date();
        this.currentYear = d.getFullYear();
        var value_init_done = false;
        if (this.original_input.value.match("[0-9]{1,2}/[0-9]{4}")) {
            var split = this.original_input.value.split('/');
            this.selectedMonth = parseInt(split[0]);
            this.selectedYear = parseInt(split[1]);
            this.currentYear = this.selectedYear;
            value_init_done = true;
        }
        if (!this.opts.allowNull && !value_init_done) {
            this.selectedMonth = d.getMonth();
            this.selectedYear = d.getFullYear();
            if (this.bounds.min.year !== null) {
                if (this.selectedYear < this.bounds.min.year) {
                    this.selectedYear = this.bounds.min.year;
                    this.selectedMonth = this.bounds.min.month ? this.bounds.min.month : 1;
                }
                else if (this.selectedYear == this.bounds.min.year && this.selectedMonth < this.bounds.min.month) {
                    this.selectedMonth = this.bounds.min.month;
                }
            }
            if (this.bounds.max.year !== null) {
                if (this.selectedYear > this.bounds.max.year) {
                    this.selectedYear = this.bounds.max.year;
                    this.selectedMonth = this.bounds.max.month ? this.bounds.max.month : 12;
                }
                else if (this.selectedYear == this.bounds.max.year && this.selectedMonth > this.bounds.max.month) {
                    this.selectedMonth = this.bounds.max.month;
                }
            }
            this.currentYear = this.selectedYear;
        }
    };
    Monthpicker.prototype.InitOptions = function (opts) {
        this.opts = Monthpicker._clone(Monthpicker.defaultOpts);
        this.MergeOptions(opts);
        this.EvaluateOptions();
    };
    Monthpicker.prototype.UpdateOptions = function (opts) {
        this.MergeOptions(opts);
        this.EvaluateOptions();
        this.RefreshUI();
    };
    Monthpicker.prototype.MergeOptions = function (opts) {
        if (opts) {
            for (var i in opts) {
                this.opts[i] = opts[i];
            }
        }
    };
    Monthpicker.prototype.EvaluateOptions = function () {
        var bounds = {
            min: {
                year: null,
                month: null
            },
            max: {
                year: null,
                month: null
            }
        };
        if (this.opts.minValue !== null || this.opts.minYear !== null) {
            if (this.opts.minValue !== null && this.opts.minYear !== null) {
                var split = this.opts.minValue.split('/');
                var minYear1 = parseInt(this.opts.minYear), minYear2 = parseInt(split[1]);
                if (minYear1 > minYear2) {
                    bounds.min.year = minYear1;
                    bounds.min.month = 1;
                }
                else {
                    bounds.min.year = minYear2;
                    bounds.min.month = parseInt(split[0]);
                }
            }
            else if (this.opts.minValue !== null) {
                var split = this.opts.minValue.split('/');
                bounds.min.year = parseInt(split[1]);
                bounds.min.month = parseInt(split[0]);
            }
            else {
                bounds.min.year = parseInt(this.opts.minYear);
                bounds.min.month = 1;
            }
        }
        if (this.opts.maxValue !== null || this.opts.maxYear !== null) {
            if (this.opts.maxValue !== null && this.opts.maxYear !== null) {
                var split = this.opts.maxValue.split('/');
                var maxYear1 = parseInt(this.opts.maxYear), maxYear2 = parseInt(split[1]);
                if (maxYear1 < maxYear2) {
                    bounds.max.year = maxYear1;
                    bounds.max.month = 12;
                }
                else {
                    bounds.max.year = maxYear2;
                    bounds.max.month = parseInt(split[0]);
                }
            }
            else if (this.opts.maxValue !== null) {
                var split = this.opts.maxValue.split('/');
                bounds.max.year = parseInt(split[1]);
                bounds.max.month = parseInt(split[0]);
            }
            else {
                bounds.max.year = parseInt(this.opts.maxYear);
                bounds.max.month = 12;
            }
        }
        this.bounds = bounds;
    };
    Monthpicker.prototype.RefreshInputs = function () {
        if (this.selectedYear && this.selectedMonth) {
            var month_num = this.selectedMonth < 10 ? "0" + this.selectedMonth : this.selectedMonth.toString();
            this.original_input.value = month_num + '/' + this.selectedYear;
            this.input.innerHTML = this.opts.monthLabels[this.selectedMonth - 1] + " " + this.selectedYear;
        }
        else {
            this.input.innerHTML = '<span class="placeholder">' + this.original_input.placeholder + '</span>';
        }
    };
    Monthpicker.prototype.RefreshUI = function () {
        this.UpdateCalendarView();
        if (this.currentYear !== null) {
            this.year_input.innerHTML = this.currentYear.toString();
        }
        this.UpdateYearSwitches();
    };
    Monthpicker.prototype.InitIU = function () {
        this.parent = document.createElement("div");
        this.parent.classList.add("monthpicker");
        this.parent.tabIndex = -1;
        var style = getComputedStyle(this.original_input, null);
        this.parent.style.width = style.getPropertyValue("width");
        if (this.parent.style.width === "auto") {
            if (this.original_input.offsetWidth === 0) {
                this.parent.style.width = "100px";
            }
            else {
                this.parent.style.width = this.original_input.offsetWidth + "px";
            }
        }
        this.original_input.parentElement.insertBefore(this.parent, this.original_input);
        this.parent.appendChild(this.original_input);
        this.original_input.style.display = "none";
        this.input = document.createElement("div");
        this.input.classList.add("monthpicker_input");
        this.input.style.height = style.getPropertyValue("height");
        if (this.input.style.height === "auto") {
            if (this.original_input.offsetHeight === 0) {
                this.input.style.height = "20px";
            }
            else {
                this.input.style.height = this.original_input.offsetHeight + "px";
            }
        }
        this.input.style.padding = style.getPropertyValue("padding");
        this.input.style.border = style.getPropertyValue("border");
        this.parent.appendChild(this.input);
        this.selector = document.createElement("div");
        this.selector.classList.add("monthpicker_selector");
        this.selector.style.display = "none";
        var selector_str = "<table><tr><td><span class='yearSwitch down'>&lt;</span></td><td><div class='yearValue'>"
            + this.currentYear
            + "</div> </td><td><span class='yearSwitch up'>&gt;</span> </td></tr> ";
        for (var j = 0; j < 4; j++) {
            var idx = j * 3;
            var labels_months = this.opts.monthLabels.slice(idx, idx + 3);
            selector_str += "<tr><td class='month month" + (idx + 1) + "' data-m='" + (idx + 1) + "'>" + labels_months[0]
                + "</td><td class='month month" + (idx + 2) + "' data-m='" + (idx + 2) + "'>" + labels_months[1]
                + "</td><td class='month month" + (idx + 3) + "' data-m='" + (idx + 3) + "'>" + labels_months[2] + "</td></tr>";
            ;
        }
        selector_str += "</table>";
        this.selector.innerHTML = selector_str;
        this.parent.appendChild(this.selector);
    };
    Monthpicker.prototype.Init = function () {
        this.InitIU();
        this.year_input = this.selector.querySelector(".yearValue");
        this.parent.dataset["mp"] = this.id.toString();
        this.parent.addEventListener("focusin", function () {
            Monthpicker.instances[this.dataset.mp].Show();
        }, true);
        this.parent.addEventListener("focusout", function () {
            Monthpicker.instances[this.dataset.mp].Hide();
        }, true);
        this.parent.querySelector(".yearSwitch.down").addEventListener("click", function () {
            Monthpicker.instances[this.closest(".monthpicker").dataset.mp].PrevYear();
        });
        this.parent.querySelector(".yearSwitch.up").addEventListener("click", function () {
            Monthpicker.instances[this.closest(".monthpicker").dataset.mp].NextYear();
        });
        var months = this.parent.querySelectorAll(".monthpicker_selector>table tr:not(:first-child) td.month");
        for (var i = 0; i < months.length; i++) {
            months[i].addEventListener("click", function () {
                if (!this.classList.contains("off")) {
                    Monthpicker.instances[this.closest(".monthpicker").dataset.mp].SelectMonth(this.dataset.m);
                }
            });
        }
    };
    Monthpicker.prototype.SelectMonth = function (month) {
        var month_int = parseInt(month);
        if (isNaN(month_int)) {
            throw "Selected month is not a number : " + month;
        }
        if (month_int < 1 || month_int > 12) {
            throw "Month is out of range (should be in [1:12], was " + month + ")";
        }
        this.selectedMonth = month_int;
        this.selectedYear = this.currentYear;
        this.RefreshUI();
        this.RefreshInputs();
        this.ReleaseFocus();
        if (this.opts.onSelect !== null) {
            this.opts.onSelect();
        }
    };
    Monthpicker.prototype.UpdateCalendarView = function () {
        var months = this.selector.querySelectorAll(".month");
        for (var i = 0; i < months.length; i++) {
            months[i].classList.remove("selected");
        }
        if (this.selectedYear !== null && this.currentYear === this.selectedYear) {
            months[this.selectedMonth - 1].classList.add("selected");
        }
        for (var i = 0; i < months.length; i++) {
            months[i].classList.remove("off");
        }
        if (this.bounds.min.year !== null && this.currentYear <= this.bounds.min.year) {
            for (var i = 1; i < this.bounds.min.month; i++) {
                months[i - 1].classList.add("off");
            }
        }
        if (this.bounds.max.year !== null && this.currentYear >= this.bounds.max.year) {
            for (var i = 12; i > this.bounds.max.month; i--) {
                months[i - 1].classList.add("off");
            }
        }
    };
    Monthpicker.prototype.ReleaseFocus = function () {
        this.parent.blur();
    };
    Monthpicker.prototype.Show = function () {
        this.RefreshUI();
        this.selector.style.display = "block";
    };
    Monthpicker.prototype.Hide = function () {
        if (this.selectedYear !== null) {
            this.currentYear = this.selectedYear;
        }
        this.selector.style.display = "none";
    };
    Monthpicker.prototype.ShowYear = function (year) {
        this.currentYear = year;
        this.RefreshUI();
    };
    Monthpicker.prototype.UpdateYearSwitches = function () {
        var prevSwitch = this.selector.querySelector(".yearSwitch.down"), nextSwitch = this.selector.querySelector(".yearSwitch.up");
        if (this.bounds.min.year !== null && this.currentYear <= this.bounds.min.year) {
            prevSwitch.classList.add("off");
        }
        else {
            prevSwitch.classList.remove("off");
        }
        if (this.bounds.max.year !== null && this.currentYear >= this.bounds.max.year) {
            nextSwitch.classList.add("off");
        }
        else {
            nextSwitch.classList.remove("off");
        }
    };
    Monthpicker.prototype.PrevYear = function () {
        this.ShowYear(this.currentYear - 1);
    };
    Monthpicker.prototype.NextYear = function () {
        this.ShowYear(this.currentYear + 1);
    };
    Monthpicker._clone = function (obj) {
        var copy;
        if (null == obj || "object" != typeof obj)
            return obj;
        if (obj instanceof Date) {
            copy = new Date();
            copy.setTime(obj.getTime());
            return copy;
        }
        if (obj instanceof Array) {
            copy = [];
            for (var i = 0, len = obj.length; i < len; i++) {
                copy[i] = Monthpicker._clone(obj[i]);
            }
            return copy;
        }
        if (obj instanceof Object) {
            copy = {};
            for (var attr in obj) {
                if (obj.hasOwnProperty(attr))
                    copy[attr] = Monthpicker._clone(obj[attr]);
            }
            return copy;
        }
        throw new Error("Unable to copy obj! Its type isn't supported.");
    };
    Monthpicker.next_id = 1;
    Monthpicker.instances = new Array();
    Monthpicker.defaultOpts = {
        minValue: null,
        minYear: null,
        maxValue: null,
        maxYear: null,
        monthLabels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jui", "Aug", "Sep", "Oct", "Nov", "Dec"],
        onSelect: null,
        onClose: null,
        allowNull: true
    };
    return Monthpicker;
}());
if (jQuery) {
    jQuery.fn.Monthpicker = function (args, extraArgs) {
        var mode;
        if (typeof (args) === "undefined" || typeof (args) === "object") {
            mode = "ctor";
        }
        else if (typeof (args) === "string" && args === "option") {
            mode = "option";
        }
        else {
            console.error("Error : Monthpicker - bad argument (1)");
            return;
        }
        $(this).each(function (i, item) {
            switch (mode) {
                case "ctor":
                    if (item.tagName == "INPUT" && (item.getAttribute("type") == "text" || item.getAttribute("type") === null)) {
                        new Monthpicker(item, args);
                    }
                    else {
                        console.error("Monthpicker must be called on a text input");
                    }
                    break;
                case "option":
                    if (item.tagName == "INPUT" && (item.getAttribute("type") == "text" || item.getAttribute("type") === null)) {
                        var mpck = Monthpicker.Get(item);
                        mpck.UpdateOptions(extraArgs);
                    }
                    else {
                        console.error("Monthpicker must be called on a text input");
                    }
                    break;
            }
        });
    };
}
//# sourceMappingURL=monthpicker.js.map