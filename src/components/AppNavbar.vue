<script setup>
import {
    Moon,
    Sun,
    Plane,
} from 'lucide-vue-next'

defineProps({
    theme: {
        type: String,
        required: true,
    },

    monthOptions: {
        type: Array,
        default: () => [],
    },

    selectedMonth: {
        type: String,
        default: '',
    },

    showMonthNav: {
        type: Boolean,
        default: true,
    },
})

const emit = defineEmits([
    'toggle-theme',
    'change-month',
])
</script>

<template>
    <nav class="nav">
        <RouterLink class="brand" to="/">
            <span class="brand-icon">
                <Plane :size="20" />
            </span>
            <div> <strong>SaveFlow</strong>
                <p>東京便宜機票</p>
            </div>
        </RouterLink>

        <div class="nav-right">

            <div v-if="showMonthNav && monthOptions.length" class="month-nav">
                <button v-for="month in monthOptions" :key="month.value"
                    :class="{ active: selectedMonth === month.value }" @click="emit('change-month', month.value)">
                    {{ month.label }}
                </button>
            </div>

            <div class="nav-links">
                <RouterLink class="nav-link" to="/daily-report">
                    機票日報
                </RouterLink>
                <RouterLink class="nav-link" to="/">
                    機票
                </RouterLink>

                <RouterLink class="nav-link" to="/why-saveflow">
                    <span class="desktop-label">
                        為什麼 SaveFlow
                    </span>

                    <span class="mobile-label">
                        SaveFlow
                    </span>
                </RouterLink>
            </div>

            <button class="icon-button" @click="emit('toggle-theme')">
                <Sun v-if="theme === 'dark'" :size="18" />

                <Moon v-else :size="18" />
            </button>

        </div>
    </nav>
</template>

<style scoped>
.nav {
    display: flex;
    align-items: center;
    justify-content: space-between;

    padding: 24px 0;
}

.brand {
    display: flex;
    align-items: center;
    gap: 12px;

    flex-shrink: 0;

    color: var(--text);
    text-decoration: none;
}

.nav-right {
    display: flex;
    align-items: center;
    gap: 16px;
}

.nav-links {
    display: flex;
    align-items: center;
    gap: 8px;
}

.brand p {
    margin: 1px 0 0;
    color: var(--muted);
    font-size: 13px;
}

.brand strong {
    font-size: 18px;
}

.brand-icon {
    display: flex;
    width: 44px;
    height: 44px;
    align-items: center;
    justify-content: center;

    border: 1px solid color-mix(in srgb,
            var(--primary) 38%,
            transparent);
    border-radius: 15px;

    color: #111827;
    background:
        linear-gradient(135deg,
            var(--primary),
            var(--primary-2));

    box-shadow:
        0 12px 34px color-mix(in srgb,
            var(--primary) 20%,
            transparent);
}



.nav-link {
    display: inline-flex;
    min-height: 40px;
    padding: 0 14px;
    align-items: center;
    justify-content: center;

    border: 1px solid transparent;
    border-radius: 999px;

    color: var(--muted);
    font-size: 14px;
    font-weight: 700;
    text-decoration: none;
}

.nav-link:hover {
    color: var(--text);
    background: var(--panel-soft);
}

.nav-link.router-link-exact-active {
    color: var(--text);
    border-color: var(--line);
    background: var(--panel-soft);
}

.nav-actions {
    justify-self: end;
    display: flex;
    align-items: center;
    gap: 10px;
    min-width: 0;
}

.month-nav {
    display: flex;
    align-items: center;
    gap: 5px;
    padding: 4px;

    border: 1px solid var(--line, rgba(148, 163, 184, 0.24));
    border-radius: 999px;

    background: var(--panel-soft,
            rgba(148, 163, 184, 0.08));
}

.month-nav button {
    flex-shrink: 0;
    min-width: 44px;
    min-height: 34px;
    padding: 7px 12px;

    border: 0;
    border-radius: 999px;

    color: var(--muted, #94a3b8);
    background: transparent;

    font: inherit;
    font-size: 13px;
    font-weight: 800;

    cursor: pointer;
    transition:
        color 0.2s ease,
        background 0.2s ease;
}

.month-nav button:hover {
    color: var(--text, #f8fafc);
}

.month-nav button.active {
    color: #111827;
    background: linear-gradient(135deg,
            var(--primary, #facc15),
            var(--primary-2, #fb923c));
}

.icon-button {
    display: inline-flex;
    flex: 0 0 auto;
    align-items: center;
    justify-content: center;

    width: 42px;
    height: 42px;
    padding: 0;

    border: 1px solid var(--line, rgba(148, 163, 184, 0.24));
    border-radius: 999px;

    color: var(--text, #f8fafc);
    background: var(--panel-soft,
            rgba(148, 163, 184, 0.08));

    cursor: pointer;
    transition:
        border-color 0.2s ease,
        background 0.2s ease;
}

.icon-button:hover {
    border-color: var(--primary, #facc15);
    background: var(--blue-soft,
            rgba(59, 130, 246, 0.12));
}

.mobile-label {
    display: none;
}

@media(max-width:768px) {

    .desktop-label {
        display: none;
    }

    .mobile-label {
        display: inline;
    }

}

@media (max-width: 768px) {
    .page {
        width: min(100% - 20px, 1180px);
    }

    /* =========================
     Navbar
  ========================== */

    .nav {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        padding: 16px 0;
    }

    .brand {
        min-width: 0;
        gap: 10px;
    }

    .brand-icon {
        width: 42px;
        height: 42px;
        flex: 0 0 42px;
        border-radius: 14px;
    }

    .brand strong {
        font-size: 17px;
        white-space: nowrap;
    }

    .brand p {
        font-size: 12px;
        white-space: nowrap;
    }

    .nav-right {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        gap: 6px;
        min-width: 0;
    }

    .nav-links {
        display: flex;
        align-items: center;
        gap: 2px;
    }

    .nav-link {
        min-height: 36px;
        padding: 0 9px;
        border-radius: 10px;
        font-size: 12px;
        line-height: 1.25;
        white-space: nowrap;
    }

    .month-nav {
        display: none;
    }

    .icon-button {
        width: 38px;
        height: 38px;
        flex: 0 0 38px;
    }

    /* =========================
     Hero
  ========================== */

    .hero {
        grid-template-columns: 1fr;
        gap: 14px;
    }

    .hero-main {
        padding: 28px 22px;
        border-radius: 24px;
    }

    .eyebrow {
        font-size: 12px;
        letter-spacing: 0.03em;
    }

    .hero-main h1 {
        margin: 22px 0 18px;
        font-size: clamp(38px, 11vw, 54px);
        line-height: 1.12;
        letter-spacing: -0.045em;

        /* word-break: keep-all; */
        overflow-wrap: normal;
    }

    .hero-description {
        font-size: 15px;
        line-height: 1.85;

        word-break: normal;
        overflow-wrap: break-word;
    }

    .hero-tags {
        gap: 8px;
        margin-top: 22px;
    }

    .hero-tags span {
        padding: 8px 11px;
        font-size: 12px;
    }

    .best-panel {
        min-height: auto;
    }

    /* =========================
     Content
  ========================== */

    .section-head {
        align-items: flex-start;
        flex-direction: column;
        gap: 10px;
    }

    .section-head h2 {
        font-size: 30px;
        line-height: 1.2;
    }

    .summary-grid {
        grid-template-columns: 1fr;
    }

    .flight-card-main {
        grid-template-columns: 1fr;
        gap: 20px;
    }

    .route {
        justify-content: space-between;
    }

    .price-box {
        align-items: flex-start;
        text-align: left;
    }

    .price-box a {
        width: 100%;
        justify-content: center;
    }
}
</style>