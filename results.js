const ResultName = document.getElementById("ResultName");
const ResultLead = document.getElementById("ResultLead");
const ResultMeta = document.getElementById("ResultMeta");
const ResultMeaning = document.getElementById("ResultMeaning");
const ResultValues = document.getElementById("ResultValues");
const ResultRisk = document.getElementById("ResultRisk");
const ResultAxes = document.getElementById("ResultAxes");
const ResultReflection = document.getElementById("ResultReflection");

const ResultContent = {
	"balanced-center": {
		name: "Balanced Center",
		lead: "Your answers place you near the middle of the graph, suggesting that neither Adam I nor Adam II completely swallows the other in your self-understanding.",
		meaning: "A centered result suggests tension rather than simplicity. In Rav Soloveitchik's framework, that can mean you feel both the call to build and the call to surrender, both the demand for achievement and the demand for covenant.",
		values: "You seem to value range, proportion, and the ability to move between mastery and faithfulness instead of making one side your whole identity.",
		risk: "The danger of this result is vagueness: if everything matters equally, it can become difficult to decide which voice should lead at a particular moment.",
		reflection: "If this result feels right, your personal reflection can argue that you live in the oscillation itself: sometimes Adam I is stronger, sometimes Adam II is stronger, and your real experience is the tension Rav describes rather than a clean victory for one side.",
	},
	"majestic": {
		name: "Majestic",
		lead: "Your result leans strongly toward the majestic side of the chart.",
		meaning: "That means the Adam I impulse is prominent in you: the urge to create, organize, shape, and leave an imprint on the world.",
		values: "This result values capability, creativity, momentum, mastery, and outward achievement.",
		risk: "Its danger is forgetting that control is not the same thing as depth, and that victory over the world cannot by itself answer spiritual loneliness.",
		reflection: "If this result feels accurate, your reflection can say that you recognize in yourself the desire to accomplish, improve, and act effectively, while still asking whether that is enough for a full religious life.",
	},
	"redeemed": {
		name: "Redeemed",
		lead: "Your result leans strongly toward the redeemed side of the chart.",
		meaning: "That means the Adam II impulse is prominent in you: the side of the person that is aware of dependence, moral limitation, and the need for return and humility.",
		values: "This result values inwardness, repentance, humility, dependence on God, and the search for spiritual truth over conquest.",
		risk: "Its danger is passivity or collapse, as if weakness itself were already holiness.",
		reflection: "If this result feels accurate, your reflection can emphasize that the deepest parts of your life are not your achievements but the relationships and obligations that call you beyond yourself.",
	},
	"covenantal": {
		name: "Covenantal",
		lead: "Your result leans strongly toward the covenantal side of the chart.",
		meaning: "This suggests that you understand the self through relationship, obligation, and belonging rather than through autonomy alone.",
		values: "This result values fidelity, communal ties, duty, trust, and the willingness to answer to something higher than the isolated self.",
		risk: "Its danger is becoming so defined by belonging that independence and moral courage weaken.",
		reflection: "If this result feels accurate, your reflection can stress that you are most alive when your choices are connected to loyalty, commitment, and the people or ideals to which you bind yourself.",
	},
	"dignified": {
		name: "Dignified",
		lead: "Your result leans strongly toward the dignified side of the chart.",
		meaning: "This means you seem drawn toward self-command, responsibility, inner standards, and the serious labor of becoming a worthy human being.",
		values: "This result values discipline, moral seriousness, coherence, restraint, and the ability to answer to conscience.",
		risk: "Its danger is hardness: dignity can slip into pride, severity, or emotional distance.",
		reflection: "If this result feels accurate, your reflection can focus on the importance of principles, responsibility, and holding yourself to standards even when that is difficult.",
	},
	"covenantal-majestic": {
		name: "Covenantal-Majestic",
		lead: "Your result lands in the covenantal-majestic corner.",
		meaning: "You seem to want to act strongly in the world, but not as a detached individual. Action matters to you most when it is connected to mission, loyalty, and meaningful commitment.",
		values: "This result values purposeful leadership, achievement tied to service, and communal impact.",
		risk: "Its danger is zeal without enough introspection.",
		reflection: "If this result feels accurate, your reflection can argue that you are most yourself when strength and responsibility work together rather than pulling apart.",
	},
	"dignified-majestic": {
		name: "Dignified-Majestic",
		lead: "Your result lands in the dignified-majestic corner.",
		meaning: "You seem drawn toward mastery, but with a strong emphasis on standards, competence, structure, and self-command.",
		values: "This result values excellence, discipline, power used skillfully, and the determination to shape both the self and the world.",
		risk: "Its danger is harshness toward imperfection.",
		reflection: "If this result feels accurate, your reflection can explain that you feel most comfortable when you are effective, competent, and governed by clear standards rather than by sentiment alone.",
	},
	"dignified-redeemed": {
		name: "Dignified-Redeemed",
		lead: "Your result lands in the dignified-redeemed corner.",
		meaning: "You seem especially drawn toward inner seriousness: moral responsibility, humility, restraint, and awareness of the limits of the self.",
		values: "This result values conscience, repentance, discipline, inward honesty, and spiritual gravity.",
		risk: "Its danger is turning self-examination into heaviness or withdrawal.",
		reflection: "If this result feels accurate, your reflection can stress that your deepest struggle is not external success but how to become inwardly true, disciplined, and humble.",
	},
	"covenantal-redeemed": {
		name: "Covenantal-Redeemed",
		lead: "Your result lands in the covenantal-redeemed corner.",
		meaning: "You seem especially drawn toward dependence, faithfulness, and relational spirituality rather than self-assertion or conquest.",
		values: "This result values mercy, obligation, humility, loyalty, and the life of covenant more than the life of domination.",
		risk: "Its danger is neglecting initiative or healthy strength.",
		reflection: "If this result feels accurate, your reflection can emphasize that your strongest instinct is to seek God, responsibility, and deep relationship rather than control.",
	},
	"mixed": {
		name: "Mixed",
		lead: "Your result still shows a leaning, but no single pole has swallowed the rest.",
		meaning: "That suggests a real experience of duality. The point is not that you are indecisive, but that you contain several instincts that remain in tension.",
		values: "This result values complexity, movement, and the refusal of a simplistic self-description.",
		risk: "Its danger is lack of clarity if the tensions are never named or examined.",
		reflection: "If this result feels accurate, your reflection can argue that your life is the best proof of Rav Soloveitchik's claim: human beings are not one-dimensional, and faith does not erase internal conflict.",
	},
};

function FormatAxisScore(value) {
	const rounded = Number.parseFloat(value);
	if (!Number.isFinite(rounded)) return "0.00";
	return rounded.toFixed(2);
}

function DescribeAxis(value, positiveLabel, negativeLabel) {
	const score = Number.parseFloat(value);
	if (!Number.isFinite(score) || Math.abs(score) < 0.1) return `near the middle between ${positiveLabel} and ${negativeLabel}`;
	return score > 0 ? `leaning toward ${positiveLabel}` : `leaning toward ${negativeLabel}`;
}

const Params = new URLSearchParams(window.location.search);
const ResultKey = Params.get("result") || "mixed";
const ResultLabel = Params.get("label") || "Mixed tendencies";
const AvgX = Params.get("x") || "0";
const AvgY = Params.get("y") || "0";
const Content = ResultContent[ResultKey] || ResultContent.mixed;

ResultName.textContent = Content.name;
ResultLead.textContent = ResultLabel;
ResultMeta.textContent = `Raw coordinates: x = ${FormatAxisScore(AvgX)}, y = ${FormatAxisScore(AvgY)}`;
ResultMeaning.textContent = Content.meaning;
ResultValues.textContent = Content.values;
ResultRisk.textContent = Content.risk;
ResultAxes.textContent = `On the vertical axis, you are ${DescribeAxis(AvgY, "Majestic", "Redeemed")}. On the horizontal axis, you are ${DescribeAxis(AvgX, "Covenantal", "Dignified")}.`;
ResultReflection.textContent = Content.reflection;
