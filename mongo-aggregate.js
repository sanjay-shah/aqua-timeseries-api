db.risks.aggregate([
	{ 
		$match: {
			repoName: "Docker Hub"
		}
	},
	{ 
		$group: { 
			_id: "$timestamp",
			critVulns: { $sum: "$critVulns" },
			highVulns: { $sum: "$highVulns" },
			medVulns: { $sum: "$medVulns" }
		}}
])