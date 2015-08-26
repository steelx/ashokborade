;(function ( $, window, document, undefined ) {

    $.Validate = function(el, options){
        // To avoid scope issues, use 'base' instead of 'this'
        // to reference this class from internal events and functions.
        var base = this;

        // Access to jQuery and DOM versions of element
        base.$el = $(el);
        base.el = el;

        // Add a reverse reference to the DOM object
        base.$el.data("Validate", base);

        base.defaultOptions = {};

        base.init = function(){

            base.options = $.extend({},$.Validate.defaultOptions, options);

            // initialization
            base.initVariables();
            base.initEvents();
        };

        //Functions
        base.initVariables = function(){
            base.$email = base.$el.find("input[type='email']");

            base.$submitButton = base.$el.find("[type='submit']");
            base.$textFields = base.$el.find("input[type='text']");
            base.$mobile = base.$el.find("input[type='phone']");
            base.isFormValid = false;
        };

        base.initEvents = function () {
            base.$email.on({
                'input': base.emailValidation,
                'blur': base.emailValidation
            });
            base.$mobile.on({
                'input': base.mobileNumValidation,
                'blur': base.mobileNumValidation
            });
            base.$submitButton.on("click", base.sendForm);
            base.$textFields.on("blur", base.textFieldsValidation);
        };

        base.textFieldsValidation = function (e) {

            if (e !== undefined) {
                //runs from event Listener
                base.inputFieldValidation.call(this);
            } else {
                //runs when submit button triggered
                $.each(base.$textFields, function(){
                    base.inputFieldValidation.call(this);
                });
            }

        };

        base.inputFieldValidation = function(){
            var $elem = $(this);
            if(/^[^0-9]{1,30}$/i.test($elem.val())){
                //Pass
                base.removeError($elem);
                return true;
            } else{
                //Fail
                base.addError($elem);
                return false;
            }
        };

        base.emailValidation = function () {
            //testing regular expression
            var $emailField = base.$email;
            var filter = /^[a-zA-Z0-9]+[a-zA-Z0-9_.-]+[a-zA-Z0-9_-]+@[a-zA-Z0-9]+[a-zA-Z0-9.-]+[a-zA-Z0-9]+.[a-z]{2,4}$/;

            if(filter.test($emailField.val())){
                //if it's valid email
                base.removeError($emailField);
                return true;

            } else{
                //if it's NOT valid
                base.addError($emailField);
                return false;
            }
        };

        base.mobileNumValidation = function(){
            //testing regular expression
            var $mobileField = base.$mobile;
            var filter = /^\d{10}$/;

            if(filter.test($mobileField.val())){
                //if it's valid phone
                base.removeError($mobileField);
                return true;

            } else{
                //if it's NOT valid
                base.addError($mobileField);
                return false;
            }
        };

        base.removeError = function (domField) {
            domField.parent('div').removeClass("error-field");
            domField.next("div.tooltip-error").remove();
            base.isFormValidFn();
        };
        base.addError = function (domField) {
            //Check if error already present dont add again
            if(!domField.parent('div').hasClass("error-field")){
                domField.parent("div").addClass("error-field");
                domField.after("<div class='tooltip-error'>" + domField.attr("errorMsg") + "</div>");
                base.isFormValidFn();
            }
        };

        base.isFormValidFn = function () {
            base.isFormValid = base.$el.find(".error-field").length === 0;
        };

        base.sendForm = function (e) {
            e.preventDefault();

            base.isFormValidFn();
            base.textFieldsValidation();
            base.emailValidation();
            base.mobileNumValidation();

            if (base.isFormValid) {
                base.sendAjax();
            }
        };

        base.sendAjax = function(){
            base.$submitButton.prop('disabled', true);

            $.ajax({
                url: "//formspree.io/ashokborade@gmail.com",
                type: "POST",
                data: base.$el.serializeObject(),
                cache: false,
                complete: function() {
                    // Success message
                    //clear all fields
                    base.$el.trigger("reset");
                    base.addMessage("success", "Thank you, we will get back to you soon!");
                },
                fail: function(){
                    base.addMessage("fail", "Sorry, please try again!");
                }
            });

        };

        base.addMessage = function addMessage(messagetype, message) {
            // create a new div element
            // and give it some content
            var newDiv = document.createElement("div");
            newDiv.setAttribute("id", messagetype);
            var newContent = document.createTextNode(message);
            newDiv.appendChild(newContent); //add the text node to the newly created div.

            // add the newly created element and its content into the DOM
            base.$el.before(newDiv);

            setTimeout(function(){
                $('#'+messagetype).fadeOut();
                base.$submitButton.prop('disabled', false);
            }, 5000);
        };


        // Run initializer
        base.init();
    };

    $.fn.Validate = function(option){
        return this.each(function(){
            (new $.Validate(this, option));
        });
    };

    $.fn.serializeObject = function() {
        var o = {};
        var a = this.serializeArray();
        $.each(a, function() {
            if (o[this.name]) {
                if (!o[this.name].push) {
                    o[this.name] = [o[this.name]];
                }
                o[this.name].push(this.value || '');
            } else {
                o[this.name] = this.value || '';
            }
        });
        return o;
    };

    $("#contact-form").Validate();
})( jQuery, window, document );
