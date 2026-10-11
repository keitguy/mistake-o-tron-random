import * as oboe from 'oboe';

export class LichessApi {

  private readonly url: string
  
  constructor(url) {
    this.url = url
  }

  randomUser(userCallback, errorCallback) {
    fetch(this.url + "/api/player/top/200/blitz")
      .then(response => {
        if (!response.ok) throw new Error("Unable to load players")
        return response.json()
      })
      .then(data => {
        const users = data.users || []
        if (!users.length) throw new Error("No players returned")
        const user = users[Math.floor(Math.random() * users.length)]
        userCallback((user.id || user.username).toLowerCase())
      })
      .catch(error => {
        console.error(error)
        errorCallback()
      })
  }
  
  games(user, items, itemCallback, completeCallback) {
		var all: any[] = [];
		const fixedQueryParams = "&perfType=ultraBullet,bullet,blitz,rapid,classical" +
												     "&analysed=true&evals=true&moves=true&opening=true"
		oboe({
			method: "GET",
			url: this.url + "/api/games/user/" + user + "?max=" + items + fixedQueryParams,
			headers: { Accept: "application/x-ndjson" },
		}).node("!", function(data) {
			all.push(data);
			itemCallback(data);
		}).on("end", function({}) {
			completeCallback(all);
		}).fail(function(errorReport) {
			console.error(JSON.stringify(errorReport));
		});
	}
}
