"""envmap.py: run audio/arrange.py for both cuts of this example with its drum hits and its guitar and bass notes
recorded, and write modules/envmap.js (window.ENVMAP = {cut: {kick: [t], snare: [t], hats: [t], ohats: [t], toms: [t],
guitar: [[t, dur, gain, mute]], bass: [[t, dur, gain]], fx: [[t, dur, gain]]}}), so scenes can react to each instrument
exactly when it sounds. The WAVs it writes are the ones arrange.py writes anyway (the arranger is deterministic), so
run it instead of the arrange step, or after it, whenever the plan or the music changes.

    python3 skills/motion-showreel/examples/rock-stage/envmap.py"""
import sys, json, pathlib
P = pathlib.Path(__file__).resolve().parent; A = P.parent.parent / 'audio'   # this example, and the skill's audio/
sys.path.insert(0, str(A))
import arrange, synth as S
rec, in_hit = [], [False]
o_hit, o_add = arrange.Arranger.hit, arrange.Arranger.add
def hit(self, piece, b, st, vel, heavy):
    rec.append(('d', piece, round(self.swung(b, st), 4), round(vel, 3))); in_hit[0] = True
    try: return o_hit(self, piece, b, st, vel, heavy)
    finally: in_hit[0] = False
def add(self, bus, sig, t, pan=0.0, gain=1.0, rev=0.0, dly=0.0):
    if not in_hit[0] and bus in ('motion', 'bass', 'drums', 'fx'):
        rec.append(('n', bus, round(float(t), 4), round(len(sig) / S.SR, 3), round(float(gain), 4)))
    return o_add(self, bus, sig, t, pan=pan, gain=gain, rev=rev, dly=dly)
arrange.Arranger.hit, arrange.Arranger.add = hit, add
out = {}
for cut in ('short', '30'):
    rec.clear()
    arrange.main(['--project', str(P), '--cut', cut, '--quiet'])
    m = {'kick': [], 'snare': [], 'hats': [], 'ohats': [], 'toms': [], 'guitar': [], 'bass': [], 'fx': []}
    for r in rec:
        if r[0] == 'd':
            if r[1] in m: m[r[1]].append(r[2])
        elif r[1] == 'motion': m['guitar'].append([r[2], r[3], r[4], 1 if r[3] < 0.3 else 0])
        elif r[1] == 'bass': m['bass'].append([r[2], r[3], r[4]])
        else: m['fx'].append([r[2], r[3], r[4]])
    for k in m: m[k] = sorted(m[k], key=lambda v: v if isinstance(v, float) else v[0])
    m['guitar'] = [g for i, g in enumerate(m['guitar']) if i == 0 or abs(g[0] - m['guitar'][i - 1][0]) > 0.003]   # one per double-tracked hit
    out[cut] = m
    print(cut, {k: len(v) for k, v in m.items()})
(P / 'modules').mkdir(exist_ok=True)
(P / 'modules/envmap.js').write_text('// envmap: when each instrument sounds in each cut (written by envmap.py from the arranger, do not edit by hand)\n'
                                     'window.ENVMAP = ' + json.dumps(out, separators=(',', ':')) + ';\n')
print('modules/envmap.js', (P / 'modules/envmap.js').stat().st_size // 1024, 'KB')
