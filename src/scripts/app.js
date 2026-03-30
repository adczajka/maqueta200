// This file serves as the main JavaScript entry point for the application.
// It initializes the application, sets up event listeners for the form, 
// and manages the overall flow of the application.

document.addEventListener('DOMContentLoaded', () => {
    const form                = document.getElementById('agent-request-form');
    const apellido1Input      = document.getElementById('apellido1');
    const apellido2Input      = document.getElementById('apellido2');
    const nombresInput        = document.getElementById('nombres');
    const fichaInput          = document.getElementById('ficha');
    const inmateIdInput       = document.getElementById('inmate-id');
    const aCargoInput         = document.getElementById('a-cargo');
    const delitoInput         = document.getElementById('delito');
    const venceInput          = document.getElementById('vence');
    const nosocomioInput      = document.getElementById('nosocomio');
    const pisoInput           = document.getElementById('piso');
    const habitacionInput     = document.getElementById('habitacion');
    const horasDesdeInput     = document.getElementById('horas-desde');
    const horasHastaInput     = document.getElementById('horas-hasta');
    const diagnosticoInput    = document.getElementById('diagnostico');
    const descriptionInput    = document.getElementById('description');

    const previewEmpty        = document.getElementById('preview-empty');
    const previewContent      = document.getElementById('preview-content');
    const notificationPreview = document.getElementById('notification-preview');
    const agentPreviewList    = document.getElementById('agent-preview-list');
    const previewActions      = document.getElementById('preview-actions');
    const confirmedSection    = document.getElementById('confirmed-section');
    const confirmedMessage    = document.getElementById('confirmed-message');
    const confirmedActions    = document.getElementById('confirmed-actions');
    const confirmBtn          = document.getElementById('confirm-request');
    const cancelBtn           = document.getElementById('cancel-request');
    const newRequestBtn       = document.getElementById('new-request');
    const modal               = document.getElementById('confirm-modal');
    const modalConfirmBtn     = document.getElementById('modal-confirm');
    const modalCancelBtn      = document.getElementById('modal-cancel');
    const clearFormBtn        = document.getElementById('clear-form-btn');
    // Botón para limpiar el formulario
    if (clearFormBtn) {
        clearFormBtn.addEventListener('click', clearAll);
    }

    // Historial
    const historyList         = document.getElementById('history-list');
    const clearHistoryBtn     = document.getElementById('clear-history');

    // Renderizar historial de solicitudes
    function renderHistory() {
        const history = requestTracker.getHistory();
        if (!historyList) return;
        if (!history || history.length === 0) {
            historyList.innerHTML = '<li style="color:var(--color-muted);text-align:center;">Sin solicitudes previas</li>';
            return;
        }
        historyList.innerHTML = history.map((item, idx) => {
            const notif = item.notification;
            const agents = item.agents || [];
            const finished = item.finished;
            return `<li${finished ? ' class="history-finished"' : ''}>
                <div class="history-title">${notif.nombre || 'Sin nombre'} <span class="history-meta">(${new Date(item.timestamp).toLocaleString('es-AR')})</span></div>
                <div class="history-meta">Ficha: ${notif.ficha || '-'} | ID: ${notif.id || '-'}</div>
                <div class="history-meta">Nosocomio: ${notif.nosocomio || '-'} | Horario: ${notif.horario || '-'}</div>
                <div class="history-agents">
                    ${agents.map(a => `<span class="history-agent-badge">${a.name}</span>`).join(' ')}
                </div>
                <div class="history-actions-row">
                    ${finished
                        ? '<span class="history-finished-label">Finalizado</span>'
                        : `<button class="btn-extend" data-history-idx="${idx}">Extender</button>
                           <button class="btn-finish" data-finish-idx="${idx}">Terminar pedido</button>`}
                </div>
            </li>`;
        }).join('');
    }

    // Extensión: variables para agentes extra
    let extendingRequestId = null;


    function loadHistoryToForm(historyIdx) {
        const history = requestTracker.getHistory();
        const item = history[historyIdx];
        if (!item) return;
        const notif = item.notification;
        // Separar apellidos y nombres
        const nombreSplit = notif.nombre.split(',');
        const apellidos = (nombreSplit[0] || '').trim().split(' ');
        apellido1Input.value = apellidos[0] || '';
        apellido2Input.value = apellidos[1] || '';
        nombresInput.value = (nombreSplit[1] || '').trim();
        fichaInput.value = notif.ficha || '';
        inmateIdInput.value = notif.id || '';
        aCargoInput.value = notif.aCargo || '';
        delitoInput.value = notif.delito || '';
        venceInput.value = notif.vence || '';
        nosocomioInput.value = notif.nosocomio || '';
        pisoInput.value = (notif.ubicacion?.match(/Piso (\w+)/) || [])[1] || '';
        habitacionInput.value = (notif.ubicacion?.match(/Hab\. (\w+)/) || [])[1] || '';
        horasDesdeInput.value = notif.horario?.split('—')[0]?.replace('hs.', '').trim() || '';
        horasHastaInput.value = notif.horario?.split('—')[1]?.replace('hs.', '').trim() || '';
        diagnosticoInput.value = notif.diagnostico || '';
        descriptionInput.value = notif.obs || '';
        extendingRequestId = item.id;
        showEmpty();
    }

    // Delegar click en botón extender
    if (historyList) {
        historyList.addEventListener('click', (e) => {
            const btn = e.target.closest('.btn-extend');
            if (btn) {
                const idx = btn.getAttribute('data-history-idx');
                if (idx !== null) {
                    loadHistoryToForm(Number(idx));
                }
                return;
            }
            const btnFinish = e.target.closest('.btn-finish');
            if (btnFinish) {
                const idx = btnFinish.getAttribute('data-finish-idx');
                if (idx !== null) {
                    finishRequest(Number(idx));
                }
            }
        });
    }

    // Lógica para terminar un pedido y liberar agentes
    function finishRequest(idx) {
        if (!confirm('¿Seguro que desea terminar este pedido? Los agentes quedarán disponibles para nuevas solicitudes.')) return;
        requestTracker.finishRequestByIdx(idx);
        renderHistory();
    }

    // Limpiar historial
    if (clearHistoryBtn) {
        clearHistoryBtn.addEventListener('click', () => {
            if (confirm('¿Seguro que desea borrar todo el historial?')) {
                requestTracker.clearHistory();
                renderHistory();
            }
        });
    }

    const DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

    let selectedAgents = [];

    const rankLabels = {
        "Guardia": "Guardia", "Cabo": "Cabo", "Cabo 1ro": "Cabo 1ro",
        "Sargento": "Sargento", "Sargento 1ro": "Sargento 1ro",
        "Sargento Ayudante": "Sarg. Ayudante", "Principal": "Principal", "Mayor": "Mayor",
    };
    const rankCssKey = {
        "Guardia": "guardia", "Cabo": "cabo", "Cabo 1ro": "cabo1",
        "Sargento": "sargento", "Sargento 1ro": "sargento1",
        "Sargento Ayudante": "sargentoay", "Principal": "principal", "Mayor": "mayor",
    };

    function rankBadge(rank) {
        return `<span class="badge badge-${rankCssKey[rank] || 'guardia'}">${rankLabels[rank] || rank}</span>`;
    }

    function callBadge(agentId) {
        const count = requestTracker.getCallCount(agentId);
        return count === 0
            ? `<span class="badge badge-new">Nuevo</span>`
            : `<span class="badge badge-called">Llamado ${count}×</span>`;
    }

    // Assign one day per agent starting from today, cycling through the week
    function assignDays(agents) {
        const todayIndex = new Date().getDay(); // 0=Sun
        // Reorder DAYS to start from today (Sun=0 → index 6 in our array)
        const reordered = [...DAYS.slice((todayIndex + 6) % 7), ...DAYS.slice(0, (todayIndex + 6) % 7)];
        return agents.map((agent, i) => ({
            ...agent,
            assignedDay: reordered[i % 7],
        }));
    }

    function buildNotification() {
        const ap2 = apellido2Input.value ? ` ${apellido2Input.value}` : '';
        return {
            nombre:      `${apellido1Input.value}${ap2}, ${nombresInput.value}`,
            ficha:       fichaInput.value,
            id:          inmateIdInput.value,
            aCargo:      aCargoInput.value,
            delito:      delitoInput.value,
            vence:       venceInput.value,
            nosocomio:   nosocomioInput.value,
            ubicacion:   [pisoInput.value && `Piso ${pisoInput.value}`, habitacionInput.value && `Hab. ${habitacionInput.value}`].filter(Boolean).join(' — ') || '—',
            diagnostico: diagnosticoInput.value,
            horario:     `${horasDesdeInput.value} hs. — ${horasHastaInput.value} hs.`,
            obs:         descriptionInput.value || '—',
            timestamp:   new Date().toLocaleString('es-AR'),
        };
    }

    function renderNotification(n) {
        notificationPreview.innerHTML = [
            ['Interno',      n.nombre],
            ['Ficha',        n.ficha],
            ['ID',           n.id],
            ['A cargo de',   n.aCargo],
            ['Delito',       n.delito],
            ['Vence',        n.vence],
            ['Nosocomio',    n.nosocomio],
            ['Ubicación',    n.ubicacion],
            ['Diagnóstico',  n.diagnostico],
            ['Horario',      n.horario],
            ['Observaciones',n.obs],
            ['Fecha/Hora',   n.timestamp],
        ].map(([label, val]) => `
            <div class="notif-row">
                <span class="notif-label">${label}</span>
                <span class="notif-value">${val}</span>
            </div>
        `).join('');
    }

    function renderAgents(agents) {
        const horario = `${horasDesdeInput.value} — ${horasHastaInput.value} hs.`;
        agentPreviewList.innerHTML = agents.map((agent, i) => `
            <li>
                <div class="agent-row">
                    <div class="agent-header">
                        <span class="agent-index">#${i + 1}</span>
                        <span class="agent-name">${agent.name}</span>
                    </div>
                    <div class="agent-badges">
                        ${rankBadge(agent.rank)}
                        ${callBadge(agent.id)}
                        <span class="badge badge-available">🟢 Disponible</span>
                    </div>
                    <div class="agent-schedule">
                        <span class="schedule-chip">📅 ${agent.assignedDay}</span>
                        <span class="schedule-chip">🕐 ${horario}</span>
                    </div>
                </div>
            </li>
        `).join('');
    }

    function showPreview() {
        previewEmpty.classList.add('hidden');
        confirmedSection.classList.add('hidden');
        confirmedActions.classList.add('hidden');
        previewContent.classList.remove('hidden');
        previewActions.classList.remove('hidden');
        // Ya no hay opción de agentes extra
    }

    function showEmpty() {
        previewContent.classList.add('hidden');
        previewActions.classList.add('hidden');
        confirmedSection.classList.add('hidden');
        confirmedActions.classList.add('hidden');
        previewEmpty.classList.remove('hidden');
    }

    function showConfirmed(count) {
        previewContent.classList.add('hidden');
        previewActions.classList.add('hidden');
        previewEmpty.classList.add('hidden');
        confirmedSection.classList.remove('hidden');
        confirmedActions.classList.remove('hidden');
        confirmedMessage.textContent = `${count} agente(s) han sido notificados exitosamente.`;
    }

    function clearAll() {
        form.reset();
        selectedAgents = [];
        notificationPreview.innerHTML = '';
        agentPreviewList.innerHTML = '';
        extendingRequestId = null;
        showEmpty();
    }
    // Eliminada lógica de agregar agentes extra
        // Form submit — find agents and show preview
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            let agentCount = 5;
            // Usar el input de cantidad de agentes del formulario principal siempre
            const mainAgentsInput = document.getElementById('main-agents-input');
            if (mainAgentsInput) {
                agentCount = parseInt(mainAgentsInput.value, 10);
                if (isNaN(agentCount) || agentCount < 1) agentCount = 1;
            }
            // Obtener IDs de agentes ya notificados en pedidos NO finalizados
            let alreadyNotifiedIds = [];
            const history = requestTracker.getHistory();
            history.forEach(item => {
                if (!item.finished && item.agents && Array.isArray(item.agents)) {
                    alreadyNotifiedIds.push(...item.agents.map(a => a.id));
                }
            });
            // Filtrar agentes disponibles que no hayan sido notificados en pedidos activos
            const allAvailable = mockDatabase.getAllAgents().filter(a => a.available && !alreadyNotifiedIds.includes(a.id));
            const raw = allAvailable.slice(0, agentCount);
            selectedAgents = assignDays(raw);
            if (selectedAgents.length === 0) {
                alert('No hay agentes disponibles en este momento.');
                return;
            }
            renderNotification(buildNotification());
            renderAgents(selectedAgents);
            showPreview();
        });

    // ...existing code...

    // Open modal
    confirmBtn.addEventListener('click', () => {
        modal.classList.remove('hidden');
    });

    // Modal — confirm
    modalConfirmBtn.addEventListener('click', () => {
        const notificationData = buildNotification();
        requestTracker.record(selectedAgents, notificationData);
        modal.classList.add('hidden');
        showConfirmed(selectedAgents.length);
        selectedAgents = [];
        extendingRequestId = null;
        renderHistory();
    });

    // Modal — cancel (go back to preview, allow editing)
    modalCancelBtn.addEventListener('click', () => {
        modal.classList.add('hidden');
    });

    // Cancel from preview — go back to empty
    cancelBtn.addEventListener('click', () => {
        selectedAgents = [];
        showEmpty();
    });

    // New request
    newRequestBtn.addEventListener('click', clearAll);

    // Render historial al cargar
    renderHistory();
});