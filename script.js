let QuizForm = document.getElementById("Quiz") || document.querySelector('form');
let QuestionsContainer = document.getElementById("Questions");
let ResultsText = document.getElementById("Results");
let ResultContainer = document.getElementById("ResultArea");
let Placement = document.getElementById("Placement");
let ProgressText = document.querySelector(".ProgressText");
let ProgressFill = document.getElementById("ProgressFill");
let Questions = [];

fetch('questions.json')
	.then((res) => res.json())
	.then((data) => {
		Questions = data;
		RenderQuestions();
		UpdateProgress();
	})
	.catch((err) => {});

function RenderQuestions() {
	if (!QuestionsContainer) 
        return;
	let Html = '';
	Questions.forEach((Question, QuestionIndex) => {
		let Name = `q${QuestionIndex}`;
		Html += `<div class="question-block" data-index="${QuestionIndex}">`;
		Html += `<div class="question">${QuestionIndex + 1}) ${Question.text}</div>`;
		Question.options.forEach((Option) => {
			let Type = Question.type === 'single' ? 'radio' : 'checkbox';
			Html += `<label class="answer"><input type="${Type}" name="${Name}" data-x="${Option.x}" data-y="${Option.y}" /> ${Option.text}</label>`;
		});
		Html += `</div>`;
	});
	QuestionsContainer.innerHTML = Html;
}

function UpdateProgress() {
	if (!Questions || Questions.length === 0) return;
	let Answered = 0;
	Questions.forEach((Question, QuestionIndex) => {
		let Name = `q${QuestionIndex}`;
		let AnyChecked = !!QuizForm.querySelector(`input[name="${Name}"]:checked`);
		if (AnyChecked) 
            Answered += 1;
	});
	let Percent = Math.round((Answered / Questions.length) * 100);
	if (ProgressText) 
        ProgressText.textContent = `Progress: ${Answered}/${Questions.length}`;
	if (ProgressFill) 
        ProgressFill.style.width = `${Percent}%`;
}

QuizForm.addEventListener('change', (Event) => {
	let Input = Event.target;
	if (!Input || (Input.type !== 'checkbox' && Input.type !== 'radio')) 
        return;
	let Block = Input.closest('.question-block');
	if (Block) {
		Block.querySelectorAll('.answer').forEach((Label) => {
			let Checkbox = Label.querySelector('input');
			Label.classList.toggle('selected', !!Checkbox && Checkbox.checked);
		});
	}
	UpdateProgress();
});
QuizForm.addEventListener('submit', (Event) => {
	Event.preventDefault();
	if (!Questions || Questions.length === 0) 
        return;
	let TotalX = 0;
	let TotalY = 0;
	for (let QuestionIndex = 0; QuestionIndex < Questions.length; QuestionIndex++) {
		let Question = Questions[QuestionIndex];
		let Name = `q${QuestionIndex}`;
		let Inputs = Array.from(QuizForm.querySelectorAll(`input[name="${Name}"]`));
		let Checked = Inputs.filter((Input) => Input.checked);
		if (Checked.length === 0) {
			ResultsText.textContent = 'Please answer all questions.';
            if (ResultContainer) 
                ResultContainer.style.display = 'block';
            if (Placement) 
                Placement.style.display = 'none';
            return;
		}
		if (Question.type === 'single') {
			let DX = parseFloat(Checked[0].getAttribute('data-x')) || 0;
			let DY = parseFloat(Checked[0].getAttribute('data-y')) || 0;
			TotalX += DX;
			TotalY += DY;
		} 
        else {
			let SumX = 0;
			let SumY = 0;
			Checked.forEach((C) => {
				SumX += parseFloat(C.getAttribute('data-x')) || 0;
				SumY += parseFloat(C.getAttribute('data-y')) || 0;
			});
			TotalX += SumX / Checked.length;
			TotalY += SumY / Checked.length;
		}
	}
	let RawAvgX = TotalX / Questions.length;
	let RawAvgY = TotalY / Questions.length;
	let Stretch = 3.2;
	let Curve = 0.75;
	let Amplify = (value) => {
		let shifted = Math.max(-1, Math.min(1, value * Stretch));
		let curved = Math.sign(shifted) * Math.pow(Math.abs(shifted), Curve);
		return Math.max(-1, Math.min(1, curved));
	};
	let AvgX = Amplify(RawAvgX);
	let AvgY = Amplify(RawAvgY);
	let AbsX = Math.abs(AvgX);
	let AbsY = Math.abs(AvgY);
	let Descriptor = '';
	if (AvgX === 0 && AvgY === 0) {
		Descriptor = 'Balanced center — adaptable and steady.';
	} 
    else if (AbsX > 0.6 && AbsY > 0.6) {
		if (AvgX > 0 && AvgY > 0) Descriptor = 'Energetic-creative corner — driven and inventive.';
		if (AvgX < 0 && AvgY > 0) Descriptor = 'Organized-creative corner — thoughtful and imaginative.';
		if (AvgX < 0 && AvgY < 0) Descriptor = 'Organized-supportive corner — steady and caring.';
		if (AvgX > 0 && AvgY < 0) Descriptor = 'Energetic-supportive corner — action-oriented and empathetic.';
	} 
    else if (AbsX > 0.6 && AbsY <= 0.6) {
		Descriptor = AvgX > 0 ? 'Action-focused — you get things moving.' : 'Strategic planner — you structure and refine.';
	} 
    else if (AbsY > 0.6 && AbsX <= 0.6) {
		Descriptor = AvgY > 0 ? 'Creative-minded — you imagine and explore.' : 'People-first — you support and steady others.';
	} 
    else {
		Descriptor = 'Mixed tendencies — balanced with a slight leaning.';
	}
	ResultsText.textContent = Descriptor;
	if (ResultContainer) 
        ResultContainer.style.display = 'block';
	let EdgePct = 50;
	let PctX = 50 + AvgX * EdgePct;
	let PctY = 50 - AvgY * EdgePct;
	if (Placement) {
		Placement.style.display = 'block';
		Placement.style.left = `${PctX}%`;
		Placement.style.top = `${PctY}%`;
	}
});

document.addEventListener('keydown', (KeyEvent) => {
	if (KeyEvent.key === 'a' || KeyEvent.key === 'A') {
		Questions.forEach((Question, QuestionIndex) => {
			let Name = `q${QuestionIndex}`;
			let Inputs = Array.from(QuizForm.querySelectorAll(`input[name="${Name}"]`));
			Inputs.forEach((Input) => {
				Input.checked = false;
			});
			if (Question.type === 'single') {
				let RandomInput = Inputs[Math.floor(Math.random() * Inputs.length)];
				RandomInput.checked = true;
				RandomInput.dispatchEvent(new Event('change', { bubbles: true }));
			} 
			else {
				let RandomCount = Math.floor(Math.random() * Inputs.length) + 1;
				let SelectedInputs = [];
				let UsedIndices = new Set();
				for (let i = 0; i < RandomCount; i++) {
					let RandomIndex;
					do {
						RandomIndex = Math.floor(Math.random() * Inputs.length);
					} 
					while (UsedIndices.has(RandomIndex));
					UsedIndices.add(RandomIndex);
					SelectedInputs.push(Inputs[RandomIndex]);
				}
				SelectedInputs.forEach((Input) => {
					Input.checked = true;
					Input.dispatchEvent(new Event('change', { bubbles: true }));
				});
			}
		});
		setTimeout(() => {
			QuizForm.dispatchEvent(new Event('submit'));
		}, 100);
	}
});
