(function($, undefined){
    $(document).ready(function () {
        

        var step1 = $('.step-1');
        var step2 = $('.step-2');
        var stepOneForm = $('.step-one-form');
        var stepTwoForm = $('.step-two-form');

        // ADD EVENT LISTENERS

        stepOneForm.find('.input-container input[type="text"]').on('focus', onFocusTextHandler);
        stepOneForm.find('.input-container input[type="text"]').on('keyup', onKeyupTextHandler);
        stepOneForm.find('.input-container input[type="text"]').on('blur', onBlurHandler);
        stepOneForm.find('.button-container').on('click', onClickNextStepHandler);

        stepOneForm.find('.file_upload').on('mouseover', function(event) {
            $(this).find('.title-definition').animate({ opacity: 0 }, 400, 'easeInQuart');
            event.stopPropagation();
        });
        stepOneForm.find('.file_upload').on('mouseout', function() {
            $(this).find('.title-definition').animate({ opacity: 1 }, 400, 'easeInQuart');
            event.stopPropagation();
        });        
        stepOneForm.find('.file-button').on('click', function() {
            stepOneForm.find('.file_upload input').click();
        });

        stepTwoForm.find('.input-icon.eye').on('click', onClickTogglePassword);

        stepTwoForm.find('.input-container input[type="email"]').on('focus', onFocusEmailHandler);
        stepTwoForm.find('.input-container.email input').on('blur', onBlurEmailHandler);
        stepTwoForm.find('.input-container.password input').on('blur', onBlurPasswordHandler);
        stepTwoForm.find('.input-container.reply-password input').on('blur', onBlurReplyPasswordHandler);
        stepTwoForm.find('.button-container.back-button').on('click', onClickBackStepHandler);

        $('form').submit(function() {
            addCheckOrErrorClass( stepOneForm.find('.input-container input[type="text"]') );
            addCheckOrErrorClassEmail( stepTwoForm.find('.input-container.email input') );
            addCheckOrErrorClassPassword( stepTwoForm.find('.input-container.password input') );
            addCheckOrErrorClassReplyPassword( stepTwoForm.find('.input-container.reply-password input') );

            if( nameAndLastnameCheck() && emailAndPasswordCheck() ) {
                console.log('successful');
                $('.registration-title').text('Validation successful');
            }

            return false;
        });


        $('.button-container.registration').click(function() {
            addCheckOrErrorClassEmail( stepTwoForm.find('.input-container.email input') );
            addCheckOrErrorClassPassword( stepTwoForm.find('.input-container.password input') );
            addCheckOrErrorClassReplyPassword( stepTwoForm.find('.input-container.reply-password input') );
            if( emailAndPasswordCheck() ) {
                console.log('successful');
                $('.registration-title').text('Validation successful');
            }
        });

        // RUN TRUNSITIONS

        if( $(window).width() > 1300 ) {
            transitionStepSide();
        } else {
            transitionFormSide();
        }

        // EVENT HANDLERS        

        function onClickBackStepHandler() {
            removeCheckOrErrorClass( stepOneForm.find('.input-container input[type="text"]') );
            transitionToStepOne();
            transitionFormSide();
        }

        function onBlurEmailHandler() {
            var self = $(this);

            removeCheckOrErrorClass(self);
            addCheckOrErrorClassEmail(self);
        }

        function onBlurPasswordHandler() {
            var self = $(this);

            removeCheckOrErrorOrEyeClass(self);
            addCheckOrErrorClassPassword(self);
        }

        function onBlurReplyPasswordHandler() {
            var self = $(this);

            removeCheckOrErrorOrEyeClass(self);
            addCheckOrErrorClassReplyPassword(self);
        }

        function onFocusEmailHandler() {
            var self = $(this);

            removeCheckOrErrorClass(self);
        }

        function onClickTogglePassword() {
            var input = $(this).parent().find('input');

            if(input.attr('type') == 'password') input.attr('type', 'text');
            else if(input.attr('type') == 'text') input.attr('type', 'password');
        }
        
        function onClickNextStepHandler() {
            addCheckOrErrorClass( stepOneForm.find('.input-container input[type="text"]') );
            if( !nameAndLastnameCheck() ) return;

            removeCheckOrErrorClass( stepTwoForm.find('.input-container input') );
            transitionFormSideStepTwo();
        }

        function onBlurHandler() {
            var self = $(this);

            addCheckOrErrorClass(self);            
            if( nameAndLastnameCheck() ) addInitials();
        }

        function onFocusTextHandler() {
            var self = $(this);

            removeCheckOrErrorClass(self);
            getAcceptebleLength(self);
        }

        function onKeyupTextHandler() {
            var self = $(this);

            getAcceptebleLength(self);
        }

        // HELPER FUNCTION FOR HANDLERS

        function addCheckOrErrorClassEmail(self) {
            var value = self.val();
            var pattern = /^[-\w.]+@([A-z0-9][-A-z0-9]+\.)+[A-z]{2,4}$/;

            if(pattern.test(value) && value.indexOf(' ') < 0)
                self.css('border-color', '#4ece3d').parent()
                    .find('.input-icon').html('&nbsp;&nbsp;&nbsp;&nbsp;').addClass('check');
            else self.css('border-color', '#ff151f').parent()
                     .find('.input-icon').html('&nbsp;&nbsp;&nbsp;&nbsp;').addClass('error');
        }

        function addCheckOrErrorClassPassword(self) {
            var value = self.val();
            var pattern = /(?=^.{6,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;

            if(pattern.test(value) && value.indexOf(' ') < 0)
                self.css('border-color', '#4ece3d').parent()
                    .find('.input-icon').html('&nbsp;&nbsp;&nbsp;&nbsp;').addClass('check');
            else self.css('border-color', '#ff151f').parent()
                     .find('.input-icon').html('&nbsp;&nbsp;&nbsp;&nbsp;').addClass('error');
        }

        function addCheckOrErrorClassReplyPassword(self) {
            var replyValue = self.val();
            var value = stepTwoForm.find('.input-container.password input').val();

            if(replyValue.length > 0 && replyValue == value)
                self.css('border-color', '#4ece3d').parent()
                    .find('.input-icon').html('&nbsp;&nbsp;&nbsp;&nbsp;').addClass('check');
            else self.css('border-color', '#ff151f').parent()
                     .find('.input-icon').html('&nbsp;&nbsp;&nbsp;&nbsp;').addClass('error');            
        }

        function changeToStepOne() {

            step1.find('div.ellipse-step-one-check').removeClass('ellipse-step-one-check')
                                             .addClass('ellipse-current').removeAttr('style')
                 .find('.step-check').removeClass('step-check')
                                             .addClass('number-one-current').removeAttr('style');

            step2.find('div.ellipse-current').removeClass('ellipse-current')
                                             .addClass('ellipse-inactive').removeAttr('style')
                 .find('.number-two-current').removeClass('number-two-current')
                                             .addClass('number-two-inactive').removeAttr('style');
        }

        function changeToStepTwo() {
            step1.find('div.ellipse-current').removeClass('ellipse-current')
                                             .addClass('ellipse-step-one-check').removeAttr('style')
                 .find('.number-one-current').removeClass('number-one-current')
                                             .addClass('step-check').removeAttr('style');

            step2.find('div.ellipse-inactive').removeClass('ellipse-inactive')
                                             .addClass('ellipse-current').removeAttr('style')
                 .find('.number-two-inactive').removeClass('number-two-inactive')
                                             .addClass('number-two-current').removeAttr('style');
        }

        function emailAndPasswordCheck() {
            var email = stepTwoForm.find('.input-container.email span').hasClass('check');
            var password = stepTwoForm.find('.input-container.password span').hasClass('check');
            var replyPassword = stepTwoForm.find('.input-container.reply-password span').hasClass('check');

            return email && password && replyPassword;
        }

        function nameAndLastnameCheck() {
            var nameCheck = stepOneForm.find('.input-container.name span').hasClass('check');
            var lastnameCheck = stepOneForm.find('.input-container.lastname span').hasClass('check');

            return nameCheck && lastnameCheck;
        }

        function addInitials() {
            var nameInit = stepOneForm.find('.input-container.name input').val().slice(0, 1);
            var lastnameInit = stepOneForm.find('.input-container.lastname input').val().slice(0, 1);
            var value = nameInit.toUpperCase() + lastnameInit.toUpperCase();
            stepOneForm.find('.initials').html(value);
        }

        function removeCheckOrErrorClass(self) {
            if( self.parent().find('span').hasClass('error') )
                self.parent().find('span').removeClass('error');
            if( self.parent().find('span').hasClass('check') )
                self.parent().find('span').removeClass('check');
        }

        function removeCheckOrErrorOrEyeClass(self) {
            if( self.parent().find('span').hasClass('error') )
                self.parent().find('span').removeClass('error');
            if( self.parent().find('span').hasClass('check') )
                self.parent().find('span').removeClass('check');
            if( self.parent().find('span').hasClass('eye') )
                self.parent().find('span').removeClass('eye');
        }

        function addCheckOrErrorClass(self) {
            removeCheckOrErrorClass(self);

            var value = self.val();

            var pattern = /^[а-яА-ЯёЁa-zA-Z]+$/;

            if(value.length > 0 && pattern.test(value) && value.indexOf(' ') < 0)
                self.css('border-color', '#4ece3d').parent()
                    .find('.input-icon').html('&nbsp;&nbsp;&nbsp;&nbsp;').addClass('check');
            else self.css('border-color', '#ff151f').parent()
                     .find('.input-icon').html('&nbsp;&nbsp;&nbsp;&nbsp;').addClass('error');
        }

        function getAcceptebleLength(self ) {
            var value = 20 - self.val().length;

            if(value > 0) self.parent().find('.input-icon').text('+' + value);
            else if(value == 0) self.parent().find('.input-icon').text(value);
            else {
                self.parent().find('.input-icon').text(0);
                self.val(self.val().slice(0, 20));
            }
        }



        // TRANSITION FUNCTIONS
        // 
        // CHANGE TO STEP TWO
        
        function transitionToStepTwo() {
            transitionFadeOutToStepTwo();
        }

        function transitionFadeOutToStepTwo() {
            step1.find('.ellipse-current').animate({ opacity: 0 }, 380, 'easeInQuart');
            step1.find('.number-one-current').animate({ opacity: 0 }, 380, 'easeInQuart');
            step2.find('.ellipse-inactive').animate({ opacity: 0 }, 380, 'easeInQuart');
            step2.find('.number-two-inactive')
                 .animate({ opacity: 0 }, 380, 'easeInQuart', transitionFadeInToStepTwo);
        }

        function transitionFadeInToStepTwo() {
            changeToStepTwo();

            step1.find('.ellipse-step-one-check').animate({ opacity: 1 }, 380, 'easeInQuart');
            step1.find('.step-check').animate({ opacity: 1 }, 380, 'easeInQuart');

            step2.find('.ellipse-current').animate({ opacity: 1 }, 380, 'easeInQuart');
            step2.find('.number-two-current').animate({ opacity: 1 }, 380, 'easeInQuart');
            step2.find('.step-text').animate({ color: "#354045" }, 380, 'easeInQuart');
        }


        // CHANGE TO STEP ONE
        
        function transitionToStepOne() {
            transitionFadeOutToStepOne();
        }

        function transitionFadeOutToStepOne() {
            step1.find('.ellipse-step-one-check').animate({ opacity: 0 }, 380, 'easeInQuart');
            step1.find('.step-check').animate({ opacity: 0 }, 380, 'easeInQuart');
            step2.find('.ellipse-current').animate({ opacity: 0 }, 380, 'easeInQuart');
            step2.find('.number-two-current')
                 .animate({ opacity: 0 }, 380, 'easeInQuart', transitionFadeInToStepOne);
        }

        function transitionFadeInToStepOne() {
            changeToStepOne();

            step1.find('.ellipse-current').animate({ opacity: 1 }, 380, 'easeInQuart');
            step1.find('.number-one-current').animate({ opacity: 1 , top: '+=20px'}, {
                duration: 380,
                specialEasing: {
                    opacity: "easeInQuart",
                    top: "easeOutSine"
                }
            });

            step2.find('.ellipse-inactive').animate({ opacity: 1 }, 380, 'easeInQuart');
            step2.find('.number-two-inactive').animate({ opacity: 1 , top: '+=20px'}, {
                duration: 380,
                specialEasing: {
                    opacity: "easeInQuart",
                    top: "easeOutSine"
                }
            });
            step2.find('.step-text').animate({ color: "#ccc" }, 380, 'easeInQuart');
        }

        // STEP SIDE TRANSITIONS

        function transitionStepSide() {
            $('.step-side').removeAttr("style")
                           .animate({ width: 770 }, 900, 'easeInExpo', transitionLogo);
        }

        function transitionLogo() {
            $('.logo-container').animate({ opacity: 1 }, 380, 'easeInQuart', transitionWelcomeTitle);
        }

        function transitionWelcomeTitle() {
            $('.step-content').animate({ 'marginTop': '+=8px' }, 380, 'easeOutSine');
            $('.welcome-title').animate({ opacity: 1 }, 380, 'easeInQuart', transactionEllipseStepOne);
        }    

        function transactionEllipseStepOne() {
            step1.find('.ellipse-current').animate({ opacity: 1 }, 380, 'easeInQuart', transitionNumberOne);
        }

        function transitionNumberOne() {
            step1.find('.number-one-current').animate({ opacity: 1 , top: '+=20px'}, {
                duration: 380,
                specialEasing: {
                    opacity: "easeInQuart",
                    top: "easeOutSine"
                },
                complete: transactionStepTextStepOne
            });
        }

        function transactionStepTextStepOne() {
            step1.find('.step-text').animate({ opacity: 1 , 'marginTop': '+=15px'}, {
                duration: 380,
                specialEasing: {
                    opacity: "easeInQuart",
                    marginTop: "easeOutSine"
                },
                complete: transactionEllipseStepTwo
            });
        }

        function transactionEllipseStepTwo() {
            step2.find('.ellipse-inactive').animate({ opacity: 1 }, 380, 'easeInQuart', transitionNumberTwo);
        }

        function transitionNumberTwo() {
            step2.find('.number-two-inactive').animate({ opacity: 1 , top: '+=20px'}, {
                duration: 380,
                specialEasing: {
                    opacity: "easeInQuart",
                    top: "easeOutSine"
                },
                complete: transactionStepTextStepTwo
            });
        }

        function transactionStepTextStepTwo() {
            step2.find('.step-text').animate({ opacity: 1 , 'marginTop': '+=15px'}, {
                duration: 380,
                specialEasing: {
                    opacity: "easeInQuart",
                    marginTop: "easeOutSine"
                },
                complete: transitionHelper
            });
        }

        function transitionHelper() {
            $('.helper').animate({ opacity: 1 }, 380, 'easeInQuart', transitionFormSide);
        }




        // fORM SIDE TRANSITIONS STEP ONE

        function transitionFormSide() {
            stepTwoForm.css('display', 'none');
            $('.form-side').removeAttr("style");
            stepOneForm.removeAttr("style");
            stepOneForm.find('*').removeAttr("style");
            stepOneForm.find('.input-name:nth-child(1)').animate({ opacity: 1 , 'marginTop': '+=18px'}, {
                duration: 600,
                specialEasing: {
                    opacity: "easeInQuart",
                    marginTop: "easeOutSine"
                },
                complete: transactionInputName
            });
        }

        function transactionInputName() {
            stepOneForm.find('.input-container.name')
                       .animate({'marginTop': '+=20px'}, 600, "easeOutSine");
            stepOneForm.find('.input-container.name input')
                       .animate({ opacity: 1 }, 600, "easeInQuart", transitionLastNameTitle);
        }

        function transitionLastNameTitle() {
            stepOneForm.find('.input-name:nth-child(3)').animate({ opacity: 1 , 'marginTop': '+=18px'}, {
                duration: 600,
                specialEasing: {
                    opacity: "easeInQuart",
                    marginTop: "easeOutSine"
                },
                complete: transactionInputLastName
            });
        }

        function transactionInputLastName() {
            stepOneForm.find('.input-container.lastname')
                       .animate({'marginTop': '+=20px'}, 600, "easeOutSine");
            stepOneForm.find('.input-container.lastname input')
                       .animate({ opacity: 1 }, 600, "easeInQuart", transitionPhoneTitle);
        }

        function transitionPhoneTitle() {
            stepOneForm.find('.input-name:nth-child(5)').animate({ opacity: 1 , 'marginTop': '+=18px'}, {
                duration: 600,
                specialEasing: {
                    opacity: "easeInQuart",
                    marginTop: "easeOutSine"
                },
                complete: transactionInputPhone
            });
        }

        function transactionInputPhone() {
            stepOneForm.find('.input-container.phone')
                       .animate({'marginTop': '+=20px'}, 600, "easeOutSine");
            stepOneForm.find('.input-container.phone input')
                       .animate({ opacity: 1 }, 600, "easeInQuart", transitionStepOneRemark);
        }

        function transitionStepOneRemark() {
            stepOneForm.find('.remark').animate({ opacity: 1 }, 380, 'easeInQuart', transitionFileUpload);
        }

        function transitionFileUpload() {
            stepOneForm.find('.file_upload')
                       .animate({ opacity: 1 }, 380, 'easeInQuart', transitionDefinitionsAndImage);
        }

        function transitionDefinitionsAndImage() {
            stepOneForm.find('.file_upload').find('.initials-container').animate({ opacity: 1 , top: '+=25px'}, {
                duration: 400,
                specialEasing: {
                    opacity: "easeInQuart",
                    top: "easeOutSine"
                }
            });
            stepOneForm.find('.file_upload').find('.title-definition').animate({ opacity: 1 }, 400, 'easeInQuart');
            stepOneForm.find('.file_upload')
                       .find('.file-button').animate({ opacity: 1 }, 400, 'easeInQuart', transitionSizeLimitTitle);
        }

        function transitionSizeLimitTitle() {
            stepOneForm.find('.size-limit-title')
                       .animate({ opacity: 1 }, 380, 'easeInQuart', transactionNextStepButton);
        }

        function transactionNextStepButton() {
            stepOneForm.find('.button-container').animate({marginTop: 44}, 400, "easeOutSine");
            stepOneForm.find('input[type="button"]')
                       .animate({ opacity: 1 }, 400, "easeInQuart", transactionNextStepValueButton);
        }

        function transactionNextStepValueButton() {
            stepOneForm.find('.next-step-title')
                       .animate({ opacity: 1 }, 380, 'easeInQuart');
        }



        // fORM SIDE TRANSITIONS STEP TWO
        
        function transitionFormSideStepTwo() {                    
            stepOneForm.css('display', 'none');
            stepTwoForm.removeAttr("style");
            stepTwoForm.find('*').removeAttr("style");

            transitionToStepTwo();

            stepTwoForm.find('.input-name:nth-child(1)').animate({ opacity: 1 , 'marginTop': '+=18px'}, {
                duration: 600,
                specialEasing: {
                    opacity: "easeInQuart",
                    marginTop: "easeOutSine"
                },
                complete: transactionInputEmail
            });
        }

        function transactionInputEmail() {
            stepTwoForm.find('.input-container.email')
                       .animate({'marginTop': '+=20px'}, 600, "easeOutSine");
            stepTwoForm.find('.input-container.email input')
                       .animate({ opacity: 1 }, 600, "easeInQuart", transitionPasswordTitle);
        }

        function transitionPasswordTitle() {
            stepTwoForm.find('.input-name:nth-child(3)').animate({ opacity: 1 , 'marginTop': '+=18px'}, {
                duration: 600,
                specialEasing: {
                    opacity: "easeInQuart",
                    marginTop: "easeOutSine"
                },
                complete: transactionInputPassword
            });
        }

        function transactionInputPassword() {
            stepTwoForm.find('.input-container.password')
                       .animate({'marginTop': '+=20px'}, 600, "easeOutSine");
            stepTwoForm.find('.input-container.password input')
                       .animate({ opacity: 1 }, 600, "easeInQuart", transitionStepTwoRemark);
        }

        function transitionStepTwoRemark() {
            stepTwoForm.find('.remark').animate({ opacity: 1 }, 380, 'easeInQuart', transitionReplyPasswordTitle);
            stepTwoForm.find('.input-container.password span')
                       .animate({ opacity: 1 }, 380, "easeInQuart");
        }

        function transitionReplyPasswordTitle() {
            stepTwoForm.find('.input-name:nth-child(6)').animate({ opacity: 1 , 'marginTop': '+=18px'}, {
                duration: 600,
                specialEasing: {
                    opacity: "easeInQuart",
                    marginTop: "easeOutSine"
                },
                complete: transactionInputReplyPassword
            });
        }

        function transactionInputReplyPassword() {
            stepTwoForm.find('.input-container.reply-password')
                       .animate({'marginTop': '+=20px'}, 600, "easeOutSine");
            stepTwoForm.find('.input-container.reply-password input')
                       .animate({ opacity: 1 }, 600, "easeInQuart", transitionCaptureTitle);
        }

        function transitionCaptureTitle() {
            stepTwoForm.find('.input-name:nth-child(8)').animate({ opacity: 1 , 'marginTop': '+=18px'}, {
                duration: 600,
                specialEasing: {
                    opacity: "easeInQuart",
                    marginTop: "easeOutSine"
                },
                complete: transitionCapture
            });

            stepTwoForm.find('.input-container.reply-password span')
                       .animate({ opacity: 1 }, 380, "easeInQuart");
        }

        function transitionCapture() {
            stepTwoForm.find('.capture')
                       .animate({ opacity: 1 }, 380, 'easeInQuart', transitionCaptureDefinition);
        }

        function transitionCaptureDefinition() {
            stepTwoForm.find('.capture-definition')
                       .animate({ opacity: 1 }, 400, 'easeInQuart', transactionRegistrationButton);
        }

        function transactionRegistrationButton() {
            stepTwoForm.find('.button-container.registration').animate({marginTop: '+=44px'}, 400, "easeOutSine");
            stepTwoForm.find('input[type="submit"]')
                       .animate({ opacity: 1 }, 400, "easeInQuart", transactionRegistrationValueButton);
        }

        function transactionRegistrationValueButton() {
            stepTwoForm.find('.registration-title')
                       .animate({ opacity: 1 }, 380, 'easeInQuart', transactionBackStepButton);
        }

        function transactionBackStepButton() {
            stepTwoForm.find('.button-container.back-button').animate({marginTop: '+=44px'}, 400, "easeOutSine");
            stepTwoForm.find('input[type="button"]')
                       .animate({ opacity: 1 }, 400, "easeInQuart", transactionBackStepValueButton);
        }

        function transactionBackStepValueButton() {
            stepTwoForm.find('.back-button-title')
                       .animate({ opacity: 1 }, 380, 'easeInQuart', transitionAgreement);
        }

        function transitionAgreement() {
            stepTwoForm.find('.user-rules-and-agreement')
                       .animate({ opacity: 1 }, 380, 'easeInQuart');
        }
    });
})(jQuery);