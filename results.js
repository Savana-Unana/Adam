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
		name: "Center",
		lead: "Your result lands near the center of the graph, which means you do not fully belong to just one side of Adam I or Adam II.",
		meaning: "If you got this, then that means you probably recognize parts of yourself in all four terms. You can be productive and creative, but you also know how to slow down, depend on others, and care about things deeper than achievement alone.",
		values: "This result suggests balance. You do not seem interested in becoming only the conquering person, but you also are not trying to live only in humility or only in obligation. You move between those sides depending on what your life asks of you.",
		risk: "The downside is that balance can become indecision. If you always see truth in every side, you may struggle to decide which part of yourself should lead in a specific moment.",
		reflection: "If this result feels accurate, your reflection can focus on the fact that being human means carrying tension. You do not need to force yourself into one category. Your experience may simply be that Adam I and Adam II keep meeting each other in your daily life.",
	},
	"majestic": {
		name: "Majestic",
		lead: "Your result leans strongly toward the majestic side of the chart.",
		meaning: "If you got this, then that means you are the kind of person who wants to make things happen. You probably like creating, leading, improving, or shaping the world around you instead of just watching it happen.",
		values: "This result usually points to creativity, ambition, confidence, and the desire to leave a mark. You may care a lot about success, progress, and being able to say that what exists now is better because you were involved in it.",
		risk: "The danger is that mastery can become your whole identity. When that happens, achievement starts to matter more than depth, and control starts to matter more than relationships, humility, or faith.",
		reflection: "If this result feels accurate, your reflection can talk about how strong the drive to build is in your life. At the same time, you can ask whether being effective and successful is enough, or whether there is something in you that still wants more than visible accomplishment.",
	},
	"redeemed": {
		name: "Redeemed",
		lead: "Your result leans strongly toward the redeemed side of the chart.",
		meaning: "If you got this, then that means you are very aware that human beings are limited. You are not mainly focused on domination or conquest. Instead, you understand the importance of humility, repentance, dependence, and being restored when you fall short.",
		values: "This result values honesty about weakness, openness to help, and the belief that a person is not made whole by success alone. You likely care more about spiritual truth, emotional depth, and real change than about looking powerful.",
		risk: "The danger is that humility can turn into passivity. There is a difference between recognizing your limits and refusing to act at all, and this result can sometimes slide too far toward the second.",
		reflection: "If this result feels accurate, your reflection can focus on the fact that your life is not defined first by achievement, but by return, dependence, and the need for grace. That does not make you weak. It may simply mean you understand something important about being human.",
	},
	"covenantal": {
		name: "Covenantal",
		lead: "Your result leans strongly toward the covenantal side of the chart.",
		meaning: "If you got this, then that means you likely understand yourself through relationships, commitments, and belonging. You probably do not like the idea of living only for yourself, because your life makes the most sense when it is connected to other people and to something higher than yourself.",
		values: "This result points toward loyalty, trust, obedience, and the ability to stay committed. You may be the kind of person who takes friendships, promises, faith, and community seriously, even when doing so is inconvenient.",
		risk: "The danger is that commitment can become over-dependence. If belonging matters too much, it can become difficult to act alone, disagree, or develop a stronger sense of self apart from the people around you.",
		reflection: "If this result feels accurate, your reflection can explain that your strongest instinct is not independence, but faithfulness. You feel most like yourself when you are tied to people, ideals, and responsibilities that matter to you.",
	},
	"dignified": {
		name: "Dignified",
		lead: "Your result leans strongly toward the dignified side of the chart.",
		meaning: "If you got this, then that means you probably take yourself and your responsibilities seriously. You may be the kind of person who believes that self-control, discipline, and personal standards matter a lot.",
		values: "This result values structure, responsibility, seriousness, and the ability to hold yourself together even when things are difficult. You likely care about doing what is right, not just what is easy or what feels good in the moment.",
		risk: "The danger is that dignity can become hardness. A person who is too focused on standards can become prideful, emotionally distant, or too severe with both themselves and other people.",
		reflection: "If this result feels accurate, your reflection can talk about the importance of discipline and inner standards in your life. You may see yourself as someone who wants to be worthy, responsible, and steady, even when that costs comfort or ease.",
	},
	"covenantal-majestic": {
		name: "Covenantal-Majestic",
		lead: "Your result lands in the covenantal-majestic corner of the chart.",
		meaning: "If you got this, then that means you want to do big things, but not only for yourself. You have the drive of Adam I, yet that drive is often tied to loyalty, mission, community, or faith rather than pure self-assertion.",
		values: "This result values action with purpose. You may want to lead, create, or achieve, but you want those things to serve people, beliefs, or goals that matter beyond your own ego.",
		risk: "The danger is that passion and purpose can make you move too fast. You may become so convinced that you are acting for a good cause that you do not stop to question yourself enough.",
		reflection: "If this result feels accurate, your reflection can argue that you are at your best when strength and commitment work together. You do not just want success. You want a form of success that means something and belongs to something larger than you.",
	},
	"dignified-majestic": {
		name: "Dignified-Majestic",
		lead: "Your result lands in the dignified-majestic corner of the chart.",
		meaning: "If you got this, then that means you are likely driven, capable, and disciplined at the same time. You do not just want to succeed. You want to succeed well, with control, competence, and standards.",
		values: "This result values excellence, structure, seriousness, and the ability to shape both yourself and the world around you. You may be the kind of person who likes things done correctly, efficiently, and with intention.",
		risk: "The danger is harshness. When both mastery and discipline are strong, it can become difficult to tolerate failure, weakness, disorder, or people who do not move at your pace.",
		reflection: "If this result feels accurate, your reflection can focus on the fact that you probably feel most secure when you are effective and self-controlled. You may not just want freedom to act, but the ability to act with excellence.",
	},
	"dignified-redeemed": {
		name: "Dignified-Redeemed",
		lead: "Your result lands in the dignified-redeemed corner of the chart.",
		meaning: "If you got this, then that means you are probably a very inwardly serious person. You may care a lot about humility, conscience, self-restraint, and whether you are living in an honest and morally sound way.",
		values: "This result values depth over display. It suggests someone who thinks carefully about right and wrong, takes failure personally, and wants to improve inwardly rather than simply look impressive outwardly.",
		risk: "The danger is heaviness. Too much self-examination can become guilt, withdrawal, or a constant feeling that you are never quite enough, even when you are trying hard to live well.",
		reflection: "If this result feels accurate, your reflection can emphasize that your biggest struggle may not be external success at all. It may be the quieter struggle of becoming truthful, disciplined, and humble within yourself.",
	},
	"covenantal-redeemed": {
		name: "Covenantal-Redeemed",
		lead: "Your result lands in the covenantal-redeemed corner of the chart.",
		meaning: "If you got this, then that means you are likely drawn toward faithfulness, humility, and deep relationship more than toward competition or control. You may naturally lean toward dependence on God and connection with others.",
		values: "This result values mercy, loyalty, obedience, and the ability to care deeply. It points toward someone who does not need to dominate the world in order to feel meaningful, because meaning is already found in relationship and faith.",
		risk: "The danger is that humility and loyalty can weaken initiative. You may sometimes give too much of yourself away, or struggle to act with strength when strength is actually needed.",
		reflection: "If this result feels accurate, your reflection can focus on the fact that your strongest instinct is not conquest, but commitment. You may understand life best through faith, responsibility, and the people to whom you are bound.",
	},
	"mixed": {
		name: "Mixed",
		lead: "Your result shows a real leaning, but no single side completely takes over the rest.",
		meaning: "If you got this, then that means your personality does not fit cleanly into one term. You likely have a few strong instincts at once, and those instincts do not always work together perfectly.",
		values: "This result suggests complexity. You may be the kind of person who can be serious and social, disciplined and creative, or humble and ambitious depending on the situation.",
		risk: "The danger is confusion if you never stop to name the tension clearly. When several sides of you are active at once, it can become harder to understand what really drives your decisions.",
		reflection: "If this result feels accurate, your reflection can argue that your life does not support a simple label. Instead, it may show exactly what this project has been saying all along: a human being is not one thing, and that inner conflict is part of being real.",
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
ResultLead.textContent = Content.lead;
ResultMeta.textContent = `Raw coordinates: x = ${FormatAxisScore(AvgX)}, y = ${FormatAxisScore(AvgY)}`;
ResultMeaning.textContent = Content.meaning;
ResultValues.textContent = Content.values;
ResultRisk.textContent = Content.risk;
ResultAxes.textContent = `On the vertical axis, you are ${DescribeAxis(AvgY, "Majestic", "Redeemed")}. On the horizontal axis, you are ${DescribeAxis(AvgX, "Covenantal", "Dignified")}.`;
ResultReflection.textContent = Content.reflection;
