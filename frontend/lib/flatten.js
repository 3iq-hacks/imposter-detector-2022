const triggerWordList = ["sus", "sussy", "among", "amogus"];

/**
 * Flatten a list of words so the img knows when to do the rock face
 *
 * ex. flattenWords([
 *  {end_time: 1.5, start_time: 0.6, word: 'sus'}
 *  {end_time: 4.0, start_time: 3.5, word: 'sus'}
 * ])
 *
 * Example output:
 * [{ time: 1.5, type: 'start },
 *  { time: 2.5, type: 'end' },
 *  { time: 4.0, type: 'start' },
 *  { time: 5.0, type: 'end' }]
 * @param {WordInfo} words
 */
export const flattenWords = (words) => {
    const triggerWords = words.filter((word) =>
        triggerWordList.includes(word.word.toLowerCase())
    );

    if (triggerWords.length === 0) {
        return [];
    }

    const out = [{ time: triggerWords[0].end_time, type: "start" }];

    for (let i = 0; i < triggerWords.length - 1; i++) {
        // No overlap. Add another marker to the list
        if (triggerWords[i + 1].end_time - triggerWords[i].end_time > 1)
            out.push({ time: triggerWords[i].end_time + 1, type: "end" });
        out.push({ time: triggerWords[i + 1].end_time, type: "start" });

        // Else, there is overlap, so don't add the marker
    }

    out.push({
        time: triggerWords[triggerWords.length - 1].end_time + 1,
        type: "end",
    });
    return out;
};
