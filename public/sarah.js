class Sarah {

    static getRandomLazyString() {
        const sentenceArr = [
            "Are you stupid or something? You've wasted your entire day!",
            "You do realize that you're ruining your own life, right? Get back to work!',
            "I don't think you can solve your problems by scrolling Facebook all day. Do something productive!"
        ];
        var rand = Math.floor(Math.random() * sentenceArr.length);
        return sentenceArr[rand];
    }

    static getRandomProductiveString() {
        const sentenceArr = [
            "Congratulations! You were actually productive today! I didn't expect that.",
            "You were productive today! What an amazing feat.",
            "You are quite on a roll today. You deserve a trophy."
        ];
        var rand = Math.floor(Math.random() * sentenceArr.length);
        return sentenceArr[rand];
    }
}