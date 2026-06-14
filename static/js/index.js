window.HELP_IMPROVE_VIDEOJS = false;

// More Works Dropdown Functionality
function toggleMoreWorks() {
    const dropdown = document.getElementById('moreWorksDropdown');
    const button = document.querySelector('.more-works-btn');
    if (!dropdown || !button) return;
    
    if (dropdown.classList.contains('show')) {
        dropdown.classList.remove('show');
        button.classList.remove('active');
    } else {
        dropdown.classList.add('show');
        button.classList.add('active');
    }
}

// Close dropdown when clicking outside
document.addEventListener('click', function(event) {
    const container = document.querySelector('.more-works-container');
    const dropdown = document.getElementById('moreWorksDropdown');
    const button = document.querySelector('.more-works-btn');
    if (!dropdown || !button) return;
    
    if (container && !container.contains(event.target)) {
        dropdown.classList.remove('show');
        button.classList.remove('active');
    }
});

// Close dropdown on escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        const dropdown = document.getElementById('moreWorksDropdown');
        const button = document.querySelector('.more-works-btn');
        if (!dropdown || !button) return;
        dropdown.classList.remove('show');
        button.classList.remove('active');
    }
});

// Copy BibTeX to clipboard
function copyBibTeX() {
    const bibtexElement = document.getElementById('bibtex-code');
    const button = document.querySelector('.copy-bibtex-btn');
    const copyText = button.querySelector('.copy-text');
    
    if (bibtexElement) {
        navigator.clipboard.writeText(bibtexElement.textContent).then(function() {
            // Success feedback
            button.classList.add('copied');
            copyText.textContent = 'Cop';
            
            setTimeout(function() {
                button.classList.remove('copied');
                copyText.textContent = 'Copy';
            }, 2000);
        }).catch(function(err) {
            console.error('Failed to copy: ', err);
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = bibtexElement.textContent;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            
            button.classList.add('copied');
            copyText.textContent = 'Cop';
            setTimeout(function() {
                button.classList.remove('copied');
                copyText.textContent = 'Copy';
            }, 2000);
        });
    }
}

// Scroll to top functionality
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Show/hide scroll to top button
window.addEventListener('scroll', function() {
    const scrollButton = document.querySelector('.scroll-to-top');
    if (window.pageYOffset > 300) {
        scrollButton.classList.add('visible');
    } else {
        scrollButton.classList.remove('visible');
    }
});

// Video carousel autoplay when in view
function setupVideoCarouselAutoplay() {
    const carouselVideos = document.querySelectorAll('.results-carousel video');
    
    if (carouselVideos.length === 0) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const video = entry.target;
            if (entry.isIntersecting) {
                // Video is in view, play it
                video.play().catch(e => {
                    // Autoplay failed, probably due to browser policy
                    console.log('Autoplay prevented:', e);
                });
            } else {
                // Video is out of view, pause it
                video.pause();
            }
        });
    }, {
        threshold: 0.5 // Trigger when 50% of the video is visible
    });
    
    carouselVideos.forEach(video => {
        observer.observe(video);
    });
}

function setupDemoVideoPlayback() {
    const demoVideos = document.querySelectorAll('.demo-video');
    if (demoVideos.length === 0) return;

    demoVideos.forEach(video => {
        video.addEventListener('play', function() {
            demoVideos.forEach(otherVideo => {
                if (otherVideo !== video) {
                    otherVideo.pause();
                }
            });
        });
    });
}

function setupDemoVideoPosters(root) {
    const scope = root || document;
    const demoVideos = scope.querySelectorAll('.demo-video');
    if (demoVideos.length === 0) return;

    demoVideos.forEach(video => {
        const source = video.querySelector('source');
        if (!source) return;

        const src = source.getAttribute('src');
        if (!src || video.getAttribute('poster')) return;

        const filename = src.split('/').pop().replace(/\.mp4$/, '.png');
        video.setAttribute('poster', `static/posters/${filename}`);
    });
}

function setupDemoTabs() {
    const demoSection = document.getElementById('demos');
    const tabRow = document.querySelector('.demo-tab-row');
    const demoPanels = Array.from(document.querySelectorAll('[data-demo-panel]'));
    if (!demoSection || !tabRow || demoPanels.length === 0) {
        setupDemoVideoPosters(document);
        return;
    }

    function getPosterForSource(src) {
        return `static/posters/${src.split('/').pop().replace(/\.mp4$/, '.png')}`;
    }

    function getItemFromCard(card, fallbackTag) {
        const source = card.querySelector('source');
        if (!source) return null;

        const src = source.getAttribute('src');
        if (!src) return null;

        const titleElement = card.querySelector('h4, h5');
        const tagElement = card.querySelector('.demo-tag');
        const tagClasses = tagElement
            ? Array.from(tagElement.classList).join(' ')
            : 'demo-tag demo-tag-alt';

        return {
            src,
            poster: getPosterForSource(src),
            title: titleElement ? titleElement.textContent.trim() : 'Demo',
            tag: tagElement ? tagElement.textContent.trim() : fallbackTag,
            tagClasses
        };
    }

    function addGroup(groups, id, label, description, items) {
        const validItems = items.filter(Boolean);
        if (validItems.length === 0) return;

        groups.push({
            id,
            label,
            description,
            items: validItems
        });
    }

    function collectDemoGroups() {
        const groups = [];
        const baseCards = Array.from(document.querySelectorAll('#base-policy-demos .demo-card'));
        const retentionBase = [];
        const downstreamBase = [];

        baseCards.forEach(card => {
            const item = getItemFromCard(card, 'Base Policy');
            if (!item) return;

            if (item.tag === 'Retention') {
                retentionBase.push(item);
            } else {
                downstreamBase.push(item);
            }
        });

        addGroup(groups, 'retention-base', 'Retention Base', 'Single-task policies that maintain an object or held state before composition.', retentionBase);
        addGroup(groups, 'downstream-base', 'Downstream Base', 'Single-task policies that perform the second interaction in isolation.', downstreamBase);

        Array.from(document.querySelectorAll('#release-test-demos .release-row')).forEach(row => {
            const task = row.querySelector('.release-label h4')?.textContent.trim() || 'Release';
            const items = Array.from(row.querySelectorAll('.demo-card')).map(card => {
                const item = getItemFromCard(card, 'Release Test');
                if (!item) return null;

                return {
                    ...item,
                    title: `${task} ${item.title}`,
                    tag: 'Release Test',
                    tagClasses: 'demo-tag demo-tag-alt'
                };
            });

            addGroup(groups, `release-${task.toLowerCase()}`, `Release: ${task}`, `Release-test outcomes for ${task}.`, items);
        });

        const compositeGroups = new Map();
        Array.from(document.querySelectorAll('#success-demo-grid .demo-card-grid')).forEach(card => {
            const item = getItemFromCard(card, 'Composite');
            if (!item) return;

            const retainedSkill = item.title.split('+')[0].trim();
            if (!compositeGroups.has(retainedSkill)) {
                compositeGroups.set(retainedSkill, []);
            }

            compositeGroups.get(retainedSkill).push({
                ...item,
                tag: 'Composite',
                tagClasses: 'demo-tag'
            });
        });

        compositeGroups.forEach((items, retainedSkill) => {
            addGroup(groups, `compose-${retainedSkill.toLowerCase()}`, `${retainedSkill} Compositions`, `Composite rollouts that preserve ${retainedSkill} while completing a downstream interaction.`, items);
        });

        const frozenFailures = [];
        const ablations = [];
        Array.from(document.querySelectorAll('#failure-demo-grid .demo-card')).forEach(card => {
            const item = getItemFromCard(card, 'Comparison');
            if (!item) return;

            if (item.tag === 'Ablation') {
                ablations.push(item);
            } else {
                frozenFailures.push(item);
            }
        });

        addGroup(groups, 'frozen-grasp', 'Frozen Grasp', 'Representative frozen-grasp baseline failures.', frozenFailures);
        addGroup(groups, 'ablations', 'Ablations', 'Representative failures when residual components are removed.', ablations);

        return groups;
    }

    const demoGroups = collectDemoGroups();
    if (demoGroups.length === 0) {
        setupDemoVideoPosters(document);
        return;
    }

    const groupById = new Map(demoGroups.map(group => [group.id, group]));
    const majorGroups = [
        {
            id: 'base-policy-demo',
            label: 'Base Policy Demo',
            subgroups: ['retention-base', 'downstream-base'].map(id => groupById.get(id)).filter(Boolean)
        },
        {
            id: 'release-test',
            label: 'Release Test',
            subgroups: demoGroups.filter(group => group.id.startsWith('release-'))
        },
        {
            id: 'dexcompose',
            label: 'DexCompose',
            subgroups: demoGroups.filter(group => group.id.startsWith('compose-'))
        },
        {
            id: 'failure',
            label: 'Failure',
            subgroups: ['frozen-grasp', 'ablations'].map(id => groupById.get(id)).filter(Boolean)
        }
    ].filter(group => group.subgroups.length > 0);

    const viewer = document.createElement('div');
    viewer.className = 'demo-featured-viewer';
    viewer.setAttribute('aria-live', 'polite');
    viewer.innerHTML = `
        <div class="demo-subtab-row" role="tablist" aria-label="Demo subcategories"></div>
        <div class="demo-viewer-header">
          <div>
            <p class="demo-kicker demo-viewer-kicker"></p>
            <h3 class="demo-viewer-title"></h3>
            <p class="demo-viewer-description"></p>
          </div>
          <div class="demo-video-number-row" role="tablist" aria-label="Video options"></div>
        </div>
        <article class="demo-feature-card">
          <video class="demo-feature-video demo-video" controls muted loop playsinline preload="none">
            <source src="" type="video/mp4">
          </video>
          <div class="demo-feature-copy">
            <span class="demo-tag demo-feature-tag"></span>
            <h4 class="demo-feature-title"></h4>
            <p class="demo-feature-count"></p>
          </div>
        </article>
    `;

    tabRow.insertAdjacentElement('afterend', viewer);
    tabRow.innerHTML = '';
    demoSection.classList.add('is-viewer-mode');
    demoPanels.forEach(panel => {
        panel.hidden = true;
        panel.classList.remove('is-active');
    });

    const state = {
        majorIndex: 0,
        subgroupIndex: 0,
        itemIndex: 0
    };

    function getActiveMajorGroup() {
        return majorGroups[state.majorIndex];
    }

    function getActiveSubgroup() {
        const majorGroup = getActiveMajorGroup();
        return majorGroup.subgroups[state.subgroupIndex];
    }

    function renderSubgroupOptions() {
        const subtabRow = viewer.querySelector('.demo-subtab-row');
        const majorGroup = getActiveMajorGroup();
        subtabRow.innerHTML = '';

        majorGroup.subgroups.forEach((group, index) => {
            const button = document.createElement('button');
            button.className = 'demo-subtab-button';
            button.type = 'button';
            button.role = 'tab';
            button.textContent = group.label;
            button.dataset.demoSubtab = group.id;
            button.setAttribute('aria-selected', String(index === state.subgroupIndex));
            button.classList.toggle('is-active', index === state.subgroupIndex);
            button.addEventListener('click', () => {
                activateSubgroup(index, true);
            });
            subtabRow.appendChild(button);
        });
    }

    function renderVideoOptions() {
        const numberRow = viewer.querySelector('.demo-video-number-row');
        const group = getActiveSubgroup();
        numberRow.innerHTML = '';

        group.items.forEach((item, index) => {
            const button = document.createElement('button');
            button.className = 'demo-video-option';
            button.type = 'button';
            button.role = 'tab';
            button.textContent = String(index + 1).padStart(2, '0');
            button.setAttribute('aria-label', item.title);
            button.setAttribute('aria-selected', String(index === state.itemIndex));
            button.classList.toggle('is-active', index === state.itemIndex);
            button.addEventListener('click', () => {
                state.itemIndex = index;
                renderActiveDemo();
            });
            numberRow.appendChild(button);
        });
    }

    function renderActiveDemo() {
        const majorGroup = getActiveMajorGroup();
        const group = getActiveSubgroup();
        const item = group.items[state.itemIndex];
        const video = viewer.querySelector('.demo-feature-video');
        const source = video.querySelector('source');
        const featureTag = viewer.querySelector('.demo-feature-tag');

        video.pause();
        source.setAttribute('src', item.src);
        video.setAttribute('poster', item.poster);
        video.setAttribute('aria-label', item.title);
        video.load();

        viewer.querySelector('.demo-viewer-kicker').textContent = majorGroup.label;
        viewer.querySelector('.demo-viewer-title').textContent = item.title;
        viewer.querySelector('.demo-viewer-description').textContent = group.description;
        viewer.querySelector('.demo-feature-title').textContent = item.title;
        viewer.querySelector('.demo-feature-count').textContent = `Demo ${state.itemIndex + 1} of ${group.items.length}`;

        featureTag.className = `${item.tagClasses} demo-feature-tag`;
        featureTag.textContent = item.tag;

        renderSubgroupOptions();
        renderVideoOptions();
    }

    function activateMajorGroup(index, updateHash) {
        state.majorIndex = index;
        state.subgroupIndex = 0;
        state.itemIndex = 0;

        Array.from(tabRow.querySelectorAll('[data-demo-tab]')).forEach((button, buttonIndex) => {
            const isActive = buttonIndex === index;
            button.classList.toggle('is-active', isActive);
            button.setAttribute('aria-selected', String(isActive));
        });

        renderActiveDemo();

        if (updateHash) {
            history.replaceState(null, '', `#${majorGroups[index].id}`);
        }
    }

    function activateSubgroup(index, updateHash) {
        state.subgroupIndex = index;
        state.itemIndex = 0;
        renderActiveDemo();

        if (updateHash) {
            history.replaceState(null, '', `#${getActiveSubgroup().id}`);
        }
    }

    majorGroups.forEach((group, index) => {
        const button = document.createElement('button');
        button.className = 'demo-tab-button';
        button.type = 'button';
        button.role = 'tab';
        button.textContent = group.label;
        button.dataset.demoTab = group.id;
        button.setAttribute('aria-selected', 'false');
        button.addEventListener('click', () => activateMajorGroup(index, true));
        button.addEventListener('keydown', event => {
            if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;

            event.preventDefault();
            const offset = event.key === 'ArrowRight' ? 1 : -1;
            const nextIndex = (index + offset + majorGroups.length) % majorGroups.length;
            const nextButton = tabRow.querySelectorAll('[data-demo-tab]')[nextIndex];
            nextButton.focus();
            activateMajorGroup(nextIndex, true);
        });
        tabRow.appendChild(button);
    });

    const hashId = window.location.hash.slice(1);
    const initialMajorIndex = majorGroups.findIndex(group => group.id === hashId);
    const initialSubgroupLocation = majorGroups
        .map((majorGroup, majorIndex) => ({
            majorIndex,
            subgroupIndex: majorGroup.subgroups.findIndex(group => group.id === hashId)
        }))
        .find(location => location.subgroupIndex >= 0);

    if (initialSubgroupLocation) {
        state.majorIndex = initialSubgroupLocation.majorIndex;
        state.subgroupIndex = initialSubgroupLocation.subgroupIndex;
    } else if (initialMajorIndex >= 0) {
        state.majorIndex = initialMajorIndex;
    }

    activateMajorGroup(state.majorIndex, false);
    if (initialSubgroupLocation) {
        activateSubgroup(initialSubgroupLocation.subgroupIndex, false);
    }
}

function setupDemoFallbackTabs() {
    const tabButtons = Array.from(document.querySelectorAll('[data-demo-tab]'));
    const demoPanels = Array.from(document.querySelectorAll('[data-demo-panel]'));
    if (tabButtons.length === 0 || demoPanels.length === 0) {
        setupDemoVideoPosters(document);
        return;
    }

    function activateDemoPanel(panelId) {
        demoPanels.forEach(panel => {
            const isActive = panel.id === panelId;
            panel.hidden = !isActive;
            panel.classList.toggle('is-active', isActive);

            if (!isActive) {
                panel.querySelectorAll('video').forEach(video => video.pause());
            }
        });

        tabButtons.forEach(button => {
            const isActive = button.dataset.demoTab === panelId;
            button.classList.toggle('is-active', isActive);
            button.setAttribute('aria-selected', String(isActive));
        });

        const activePanel = document.getElementById(panelId);
        if (activePanel) {
            setupDemoVideoPosters(activePanel);
        }
    }

    tabButtons.forEach(button => {
        button.addEventListener('click', () => activateDemoPanel(button.dataset.demoTab));
    });

    const initialPanelId = demoPanels.some(panel => panel.id === window.location.hash.slice(1))
        ? window.location.hash.slice(1)
        : 'base-policy-demos';

    activateDemoPanel(initialPanelId);
}

function initializeDexComposePage() {
    var options = {
		slidesToScroll: 1,
		slidesToShow: 1,
		loop: true,
		infinite: true,
		autoplay: true,
		autoplaySpeed: 5000,
    }

	// Initialize all div with carousel class
    if (window.bulmaCarousel) {
        bulmaCarousel.attach('.carousel', options);
    }
	
    if (window.bulmaSlider) {
        bulmaSlider.attach();
    }
    
    // Setup video autoplay for carousel
    setupVideoCarouselAutoplay();
    setupDemoTabs();
    setupDemoVideoPlayback();
}

if (window.jQuery) {
    $(document).ready(initializeDexComposePage);
} else if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeDexComposePage);
} else {
    initializeDexComposePage();
}
