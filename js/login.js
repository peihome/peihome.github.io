"use strict";

import {
    setCookie,
    getUserDetails
} from "/js/cookieUtil.js";

$(document).ready(() => {

    const userDetails = getUserDetails();

    $('#loginBtn').click(() => {
        let userName = $('#userName').val();
        let password = $('#password').val();

        if (userDetails[userName]) {
            if (userDetails[userName] == password) {
                setCookie('loggedInUser', userName);
                window.location.href = '/index.html';
            } else {
                alert('Invalid password!');
            }
        } else {
            alert('Invalid user!');
        }
    });

    $('#registerBtn').click(() => {

        let userName = $('#regUserName').val();
        let password = $('#regPassword').val();
        userDetails[userName] = password;

        window.localStorage.userDetails = JSON.stringify(userDetails);
        window.location.href = '/html/login.html';
    });


    $('#signup').click(()=>{
        $('.login').addClass('dN');
        $('.registration').removeClass('dN');

        $('#register').html('Signup');
        $('#registerBtn').val('Signup');
    });

    $('#login').click(()=>{
        $('.login').removeClass('dN');
        $('.registration').addClass('dN');
    });

    $('#forgotPassword').click(()=>{
        $('.login').addClass('dN');
        $('.registration').removeClass('dN');

        $('#register').html('Reset Password');
        $('#registerBtn').val('Reset');
    });

});