const lodash = require('lodash');
const moment = require('moment');

class FBController {

    static addTodo({projectName, todo}) {
        const {currentUser} = firebase.auth();

        firebase.database().ref(`/users/${currentUser.uid}/todos/${projectName}`).push(todo).then(() => {

            console.log("Added todo: ", todo);
        });
    }

    static removeTodo({uid}) {
        const {currentUser} = firebase.auth();

        firebase.database().ref(`/users/${currentUser.uid}/todos/${uid}`).remove().then(() => {

            console.log("Removed todo");
        });
    }

    static fetchProjects(callback) {

        firebase.auth().onAuthStateChanged(function (user) {
            firebase.database().ref(`/users/${user.uid}/todos`).once('value', snapshot => {
                callback(snapshot);
            });
        });
    }

    static updateTodoState({uid, projectName, completed}) {
        const {currentUser} = firebase.auth();

        firebase.database().ref(`/users/${currentUser.uid}/todos/${projectName}/${uid}/completed`).set(completed).then(() => {
            console.log("Completed todo");
        });
    }

    static createUser({displayName, email, password}, callback) {

        firebase.auth().createUserWithEmailAndPassword(email, password).then(user => {
            user.updateProfile({
                displayName
            }).then(() => {
                console.log(user);

                callback();
            });
        }).catch((e) => console.log(e));
    }

    static loginUser({email, password}, callback) {

        firebase.auth().signInWithEmailAndPassword(email, password).then(user => {
            console.log("Logged in user successfully.");
            callback();
        }).catch((e) => console.log(e));
    }

    static authenticateUser({user}, callback) {

    }
    static fetchVisitedSites({date}, callback) {

        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                firebase.database().ref(`/users/${user.uid}/days/${date}/visited`).once('value', snapshot => {
                    callback(snapshot.val());
                });
            }
        });
    }

    static updateVisitedSitesPercentage() {
        const todayDate = moment().format('YYYY-MM-DD');

        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                firebase.database().ref(`/users/${user.uid}/days/${todayDate}/visited`).on('value', snapshot => {
                    console.log("SNAPSHOT", snapshot.val());
                });
            }
        });
    }

    static addWebsiteVisitedTime({ currentTab, visitTime }, callback) {

		const { currentUser } = firebase.auth();

		const tabHashCode = currentTab.hashCode();

		const todayDate = moment().format('YYYY-MM-DD');

        const unproductiveSites=  [
            'www.facebook.com',
            'www.youtube.com',
            'www.netflix.com',
            'www.twitter.com',
            'www.producthunt.com',
            'www.reddit.com',
            'www.9gag.com'
        ];

		let unproductive = false;

		unproductiveSites.forEach(site => {
			if (currentTab.includes(site)) {
				unproductive = true;
				return;
			}
		});

		let oldVisitTime = 0;

		firebase.database().ref(`/users/${currentUser.uid}/days/${todayDate}/visited/${tabHashCode}/visitTime`).once('value', snapshot => {
			oldVisitTime = snapshot.val();

			let totalTime = 0;

			firebase.database().ref(`/users/${currentUser.uid}/days/${todayDate}/visited/`).once('value', snapshot => {
			    _.each(snapshot.val(), site => {
                    console.log(site.visitTime);

                    totalTime += site.visitTime;
				});

				const newVisitTime = oldVisitTime + visitTime;
				let percentage = 0;

				if (totalTime == 0) {
					percentage = 100;
				} else {
					percentage = Math.floor((newVisitTime / totalTime) * 100);
				}

				console.log("TOTAL TIME", totalTime);

				firebase.database().ref(`/users/${currentUser.uid}/days/${todayDate}/visited/${tabHashCode}`).set({ link: currentTab, visitTime: newVisitTime, unproductive, percentage  }).then(() => {

					_.each(snapshot.val(), site => {

					    console.log(site);
                        const sitePercentage = Math.floor((site.visitTime / totalTime) * 100);

                        console.log("SITE PERCENT", sitePercentage);
;
                        const siteHashCode = site.link.hashCode();

                        firebase.database().ref(`/users/${currentUser.uid}/days/${todayDate}/visited/${siteHashCode}/percentage`).set(sitePercentage).then(() => callback());

					});

					console.log("Added website visit time for: ", currentTab);
				});

			});
		});

	};
}

String.prototype.hashCode = function() {
    var hash = 0, i, chr;
    if (this.length === 0) return hash;
    for (i = 0; i < this.length; i++) {
        chr   = this.charCodeAt(i);
        hash  = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
};