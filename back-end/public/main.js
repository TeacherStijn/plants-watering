document.addEventListener("DOMContentLoaded", function() {

	const loginButton = document.getElementById('loginButton');
	const saveButton = document.getElementById('saveButton');
	const loadButton = document.getElementById('loadButton');
	const outputVeld = document.getElementById('outputVeld');
		
	loginButton.addEventListener('click', async (ev)=>{
		
		ev.preventDefault();
		
		const emailData = emailInput.value;
		const apiKeyData = apiKeyInput.value;
		
		const response = await fetch('/api/save', {
			method: 'POST',
			headers: { "Content-Type": "application/json",
						'api-key': apiKeyData },
			body: JSON.stringify({ data: emailData, gameData: "" })
		});
		const data = await response.json();
	});
	
	saveButton.addEventListener('click', async (ev)=>{
		
		ev.preventDefault();

		const emailData = emailInput.value;
		const apiKeyData = apiKeyInput.value;		
		
		class Person {
			constructor(firstName, lastName) {
				this.firstName = firstName;
				this.lastName = lastName;
			}
			// Only data will be serialized, not methods
		}
		
		const gameData = new Person("Stijn", "Janssen");
		
		const response = await fetch('/api/save', {
			method: 'POST',
			headers: { "Content-Type": "application/json",
						'api-key': apiKeyData },
			body: JSON.stringify({ data: emailData, gameData: gameData })
		});
		
		try {
			const data = await response.json();
		}
		catch (err){
			data.innerHTML = "Fout bij het opslaan";
		}
	});

	loadButton.addEventListener('click', async (ev)=>{
		
		ev.preventDefault();
			
		const emailData = emailInput.value;
		const apiKeyData = apiKeyInput.value;			
			
		const response = await fetch('/api/load', {
			method: 'POST',
			headers: { "Content-Type": "application/json",
						'api-key': apiKeyData },
			body: JSON.stringify({ data: emailData })						
		});
		const data = await response.json();
		outputVeld.innerHTML = `<strong>Output:</strong><br/>Hi ${data.firstName} ${data.lastName}`;
	});	
});