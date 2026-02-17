
        // const form = document.getElementById('sieleForm');
        // const submitBtn = document.getElementById('sieleSubmit-btn');
        // const inputs = form.querySelectorAll('.form-input');
        // const successMessage = document.getElementById('success-message');

        // // Enable/disable submit button based on input validity
        // function checkFormValidity() {
        //     let allFilled = true;
        //     inputs.forEach(input => {
        //         if (!input.value.trim()) {
        //             allFilled = false;
        //         }
        //     });
        //     submitBtn.disabled = !allFilled;
        // }

        // inputs.forEach(input => {
        //     input.addEventListener('input', checkFormValidity);
        // });

        // form.addEventListener('submit', function(event) {
        //     event.preventDefault();
        //     submitBtn.disabled = true;
        //     submitBtn.querySelector('span').textContent = 'Sending...';

        //     emailjs.send("Reviews", "contact_reviews", {
        //         fullname: this.fullname.value,
        //         email: this.email.value,
        //         message: this.message.value
        //     })
        //     .then(function(response) {
        //         console.log('SUCCESS!', response.status, response.text);
        //         successMessage.classList.add('show');
        //         form.reset();
        //         submitBtn.querySelector('span').textContent = 'Send Message';
        //         submitBtn.disabled = true;
        //         setTimeout(() => {
        //             successMessage.classList.remove('show');
        //         }, 3000);
        //     }, function(error) {
        //         console.log('FAILED...', error);
        //         alert('Failed to send message. Please try again.');
        //         submitBtn.querySelector('span').textContent = 'Send Message';
        //         checkFormValidity();
        //     });
        // });
