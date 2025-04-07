document.getElementById('registrationForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Basic validation
    const email = document.getElementById('email').value;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!emailRegex.test(email)) {
        alert('Please enter a valid email address');
        return;
    }

    try {
        const formData = {
            event_type: 'registration_form',
            client_payload: {
                name: document.getElementById('name').value,
                surname: document.getElementById('surname').value,
                displayName: document.getElementById('displayName').value,
                email: email
            }
        };

        // Create an issue instead of direct workflow trigger
        const response = await fetch('https://api.github.com/repos/OWNER/REPO/issues', {
            method: 'POST',
            headers: {
                'Accept': 'application/vnd.github+json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: `Registration Request - ${email}`,
                body: `Registration request received:
                - Name: ${formData.client_payload.name}
                - Surname: ${formData.client_payload.surname}
                - Display Name: ${formData.client_payload.displayName}
                - Email: ${formData.client_payload.email}
                
                Please process this registration request.`
            })
        });

        if (response.ok) {
            // Show success message
            document.getElementById('successMessage').style.display = 'block';
            
            // Reset form after 3 seconds
            setTimeout(() => {
                this.reset();
                document.getElementById('successMessage').style.display = 'none';
            }, 3000);
        } else {
            throw new Error('Failed to submit registration');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while submitting the form. Please try again.');
    }
});
