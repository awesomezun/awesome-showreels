// dash (4 bars, 30-s cut): the dashboard. Boxes draw in one after another (CPU with a live sparkline, memory as a bar
// of blocks, network up and down, a process list that scrolls), all on the same grid of characters; 서버 상태도 한눈에.
(() => {
  const PROCS = ['nginx', 'postgres', 'redis', 'node api', 'cron', 'sshd', 'worker-1', 'worker-2', 'prometheus', 'termpan'];
  SCENES['dash'] = {
    draw(ctx, t, env) {
      const K = TTY, lt = env.lt, C = K.COL, B = K.buf(), on = i => lt > 0.2 + i * 0.35;
      const clock = new Date(Date.UTC(2026, 9, 19, 14, 32, 7) + lt * 1000).toISOString().slice(11, 19);
      K.put(B, 2, 0, `termpan · server-01 · ${clock}`, C.dim);
      const wave = (i, k) => 0.35 + 0.25 * Math.sin(i * 0.5 + lt * k) + 0.2 * Math.sin(i * 1.7 + lt * k * 1.9) + 0.1 * hash(i * 3 + Math.floor(lt * 6));
      if (on(0)) { K.box(B, 1, 1, 45, 8, 'CPU', C.dim, C.cyan); const v = Array.from({ length: 41 }, (_, i) => clamp(wave(i - lt * 8, 1.3))); K.spark(B, 3, 3, v, C.cyan); K.spark(B, 3, 4, v.map(x => x * 0.7), C.blue); K.put(B, 3, 6, `사용률 ${Math.round(v[40] * 100)}%`, C.fg); }
      if (on(1)) { K.box(B, 47, 1, 46, 8, '메모리', C.dim, C.green); const m = 0.32 + 0.05 * Math.sin(lt * 0.9); K.bar(B, 49, 3, 40, m, C.green); K.put(B, 49, 5, `${(m * 16).toFixed(1)} / 16.0 GB`, C.fg); K.bar(B, 49, 6, 40, 0.12, C.yel); }
      if (on(2)) { K.box(B, 1, 9, 45, 9, '네트워크', C.dim, C.mag); K.put(B, 3, 10, '받기', C.dim); K.spark(B, 3, 11, Array.from({ length: 41 }, (_, i) => clamp(wave(i - lt * 10, 2.1))), C.mag); K.put(B, 3, 13, '보내기', C.dim); K.spark(B, 3, 14, Array.from({ length: 41 }, (_, i) => clamp(wave(i * 1.3 - lt * 7, 1.7) * 0.6)), C.blue); }
      if (on(3)) { K.box(B, 47, 9, 46, 9, '프로세스', C.dim, C.yel); K.put(B, 49, 10, 'PID   이름            CPU', C.dim);
        const off = Math.floor(lt * 2.5); for (let i = 0; i < 6; i++) { const p = PROCS[(i + off) % PROCS.length], pid = 1000 + ((i + off) % PROCS.length) * 137, cpu = (hash(i + off * 7) * 30).toFixed(1);
          K.put(B, 49, 11 + i, `${pid}  ${p.padEnd(15)} ${cpu.padStart(5)}%`, i === 0 ? C.yel : C.fg); } }
      K.put(B, 2, 19, K.typed('서버 상태도 한눈에', lt, 1.8, 12), C.yel);
      K.put(B, 2, 21, 'q 종료   ? 도움말   / 찾기', C.dim);
      K.render(ctx, B);
    },
  };
})();
