document.getElementById('contact-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    if(name && email && message) {
        document.getElementById('form-status').innerText = 'Thank you for contacting me, I will get back to you soon!';
        document.getElementById('contact-form').reset();
    } else {
        document.getElementById('form-status').innerText = 'Please fill out all the fields.';
    }
});
