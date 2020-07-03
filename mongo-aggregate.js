db.risks.aggregate([
	{ 
		$match: {
			repoName: "k8s.gcr.io"
		}
	},
	{ 
		$group: { 
			_id: "$snapstamp",
			critVulns: { $sum: "$critVulns" },
			highVulns: { $sum: "$highVulns" },
			medVulns: { $sum: "$medVulns" }
		}}
])