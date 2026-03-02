let QuizForm = document.getElementById("Quiz") || document.querySelector('form');
let QuestionsContainer = document.getElementById("Questions");
let ResultsText = document.getElementById("Results");
let ResultContainer = document.getElementById("ResultArea");
let Placement = document.getElementById("Placement");
let ResultDetailsButton = document.getElementById("ResultDetailsButton");
let ProgressText = document.querySelector(".ProgressText");
let ProgressFill = document.getElementById("ProgressFill");
let Questions = [];

function IsMultiType(Question) {
	return Question.type === 'multi' || Question.type === 'multi_limit' || Question.type === 'multi_boost';
}

function GetSelectionLimit(Question) {
	if (Question.type !== 'multi_limit') return Infinity;
	let RawLimit = Number(Question.limit);
	if (!Number.isFinite(RawLimit) || RawLimit < 1) return 1;
	return Math.floor(RawLimit);
}

function GetMultiBoostFactor(Question, SelectedCount) {
	if (Question.type !== 'multi_boost') return 1;
	let RawBoostPerExtra = Number(Question.boost_per_extra);
	let BoostPerExtra = Number.isFinite(RawBoostPerExtra) ? RawBoostPerExtra : 0.2;
	let RawBoostMax = Number(Question.boost_max);
	let BoostMax = Number.isFinite(RawBoostMax) && RawBoostMax >= 1 ? RawBoostMax : 2;
	let Factor = 1 + Math.max(0, SelectedCount - 1) * BoostPerExtra;
	return Math.min(Factor, BoostMax);
}

function GetResultKey(ResultX, ResultY, CornerThreshold, AxisThreshold) {
	let AbsX = Math.abs(ResultX);
	let AbsY = Math.abs(ResultY);
	if (AbsX < 0.05 && AbsY < 0.05) return 'balanced-center';
	if (AbsX >= CornerThreshold && AbsY >= CornerThreshold) {
		if (ResultX > 0 && ResultY > 0) return 'covenantal-majestic';
		if (ResultX < 0 && ResultY > 0) return 'dignified-majestic';
		if (ResultX < 0 && ResultY < 0) return 'dignified-redeemed';
		if (ResultX > 0 && ResultY < 0) return 'covenantal-redeemed';
	}
	if (AbsX >= AxisThreshold && AbsY < CornerThreshold) {
		return ResultX > 0 ? 'covenantal' : 'dignified';
	}
	if (AbsY >= AxisThreshold && AbsX < CornerThreshold) {
		return ResultY > 0 ? 'majestic' : 'redeemed';
	}
	return 'mixed';
}

function UpdateResultDetailsLink(ResultKey, ResultLabel, AvgX, AvgY) {
	if (!ResultDetailsButton) return;
	let Params = new URLSearchParams({
		result: ResultKey,
		label: ResultLabel,
		x: AvgX.toFixed(2),
		y: AvgY.toFixed(2),
	});
	ResultDetailsButton.href = `results.html?${Params.toString()}`;
	ResultDetailsButton.style.display = 'inline-flex';
}

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
		let LimitLabel = Question.type === 'multi_limit' ? ` (Select up to ${GetSelectionLimit(Question)})` : '';
		let BoostLabel = Question.type === 'multi_boost' ? ' (Selecting more increases impact)' : '';
		Html += `<div class="question">${QuestionIndex + 1}) ${Question.text}${LimitLabel}${BoostLabel}</div>`;
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
		let QuestionIndex = Number(Block.getAttribute('data-index'));
		let Question = Questions[QuestionIndex];
		if (Question && Question.type === 'multi_limit') {
			let Limit = GetSelectionLimit(Question);
			let Inputs = Array.from(Block.querySelectorAll(`input[name="q${QuestionIndex}"]`));
			let Checked = Inputs.filter((Checkbox) => Checkbox.checked);
			if (Checked.length > Limit) {
				Input.checked = false;
			}
		}
	}
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
			if (ResultDetailsButton)
				ResultDetailsButton.style.display = 'none';
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
			let AvgQuestionX = SumX / Checked.length;
			let AvgQuestionY = SumY / Checked.length;
			let BoostFactor = GetMultiBoostFactor(Question, Checked.length);
			TotalX += AvgQuestionX * BoostFactor;
			TotalY += AvgQuestionY * BoostFactor;
		}
	}
	let RawAvgX = TotalX / Questions.length;
	let RawAvgY = TotalY / Questions.length;
	let ClampToGraph = (value) => Math.max(-1, Math.min(1, value));
	let AvgX = ClampToGraph(RawAvgX);
	let AvgY = ClampToGraph(RawAvgY);
	let DotMovementMultiplier = 3;
	let DescriptorX = ClampToGraph(AvgX * DotMovementMultiplier);
	let DescriptorY = ClampToGraph(AvgY * DotMovementMultiplier);
	let AbsX = Math.abs(DescriptorX);
	let AbsY = Math.abs(DescriptorY);
	let Descriptor = '';
	let CornerThreshold = 0.35;
	let AxisThreshold = 0.25;
	if (Math.abs(DescriptorX) < 0.05 && Math.abs(DescriptorY) < 0.05) {
		Descriptor = 'Center: balanced between Adam I and Adam II.';
	} 
    else if (AbsX >= CornerThreshold && AbsY >= CornerThreshold) {
		if (DescriptorX > 0 && DescriptorY > 0) Descriptor = 'Covenantal-Majestic: committed, driven, and purposeful.';
		if (DescriptorX < 0 && DescriptorY > 0) Descriptor = 'Dignified-Majestic: disciplined, capable, and achievement-focused.';
		if (DescriptorX < 0 && DescriptorY < 0) Descriptor = 'Dignified-Redeemed: serious, humble, and inwardly focused.';
		if (DescriptorX > 0 && DescriptorY < 0) Descriptor = 'Covenantal-Redeemed: faithful, relational, and humble.';
	} 
    else if (AbsX >= AxisThreshold && AbsY < CornerThreshold) {
		Descriptor = DescriptorX > 0 ? 'Covenantal: defined by commitment, belonging, and loyalty.' : 'Dignified: serious, disciplined, and self-controlled.';
	} 
    else if (AbsY >= AxisThreshold && AbsX < CornerThreshold) {
		Descriptor = DescriptorY > 0 ? 'Majestic: creative, productive, and driven to build.' : 'Redeemed: humble, dependent, and aware of human limits.';
	} 
    else {
		Descriptor = 'Mixed: several strong tendencies held in tension.';
	}
	let ResultKey = GetResultKey(DescriptorX, DescriptorY, CornerThreshold, AxisThreshold);
	ResultsText.textContent = Descriptor;
	if (ResultContainer) 
        ResultContainer.style.display = 'block';
	let EdgePct = 50;
	let PctX = Math.max(0, Math.min(100, 50 + AvgX * EdgePct * DotMovementMultiplier));
	let PctY = Math.max(0, Math.min(100, 50 - AvgY * EdgePct * DotMovementMultiplier));
	if (Placement) {
		Placement.style.display = 'block';
		Placement.style.left = `${PctX}%`;
		Placement.style.top = `${PctY}%`;
	}
	UpdateResultDetailsLink(ResultKey, Descriptor, AvgX, AvgY);
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
				let Limit = IsMultiType(Question) ? Math.min(GetSelectionLimit(Question), Inputs.length) : Inputs.length;
				let RandomCount = Math.floor(Math.random() * Limit) + 1;
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
