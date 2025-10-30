export function openEventStream(url: string, onMessage: (data: unknown) => void) {
const es = new EventSource(url);
es.onmessage = (ev) => {
try {
onMessage(JSON.parse(ev.data));
} catch {
onMessage(ev.data);
}
};
return es;
}
