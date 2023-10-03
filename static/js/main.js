const sections = $('[data-section]');
const prevButton = $('.prev-button');
const nextButton = $('.next-button');
let currentSectionIndex = 0;

const sectionContents = [
    `
        <div class="flex justify-center mx-auto mb-6 mt-2">
            <span style="background: var(--primary-color);" class="inline-block w-40 h-1 mr-1 rounded-full"></span>
            <span style="background: var(--primary-color);" class="inline-block w-3 h-1 mr-1 rounded-full"></span>
            <span style="background: var(--primary-color);" class="inline-block w-1 h-1 mr-1 rounded-full"></span>
        </div>
        <span class="text-md font-semibold text-center text-gray-800 text-center w-full">Which service would you like to use?</span>

        <div class="flex flex-col items-center justify-center gap-3 mt-16">
            <button style="min-width: 173px" class="flex flex-col border rounded-lg items-center px-10 py-4 text-sm font-medium text-gray-600 transition-colors duration-200 sm:text-base gap-x-3 w-full">
                <span>Natural Gas</span>
            </button>

            <button style="min-width: 173px" class="flex flex-col border rounded-lg items-center px-10 py-4 text-sm font-medium text-gray-600 transition-colors duration-200 sm:text-base gap-x-3 w-full">
                <span>Electric</span>
            </button>
        </div>

        <div class="border-t absolute w-full left-0 right-0 bottom-0 py-8">
            <button class="next-button btn flex gap-x-3 whitespace-no-wrap text-sm sm:text-base items-center justify-center text-white rounded-md hover:bg-[#1877F2]/80 duration-300 transition-colors border border-transparent px-16 py-3 mx-auto">
                <span>Next</span>
            </button>
        </div>
    `,
    `
        <div class="flex justify-center mx-auto mb-6 mt-2">
            <span style="background: var(--primary-color);" class="inline-block w-40 h-1 mr-1 rounded-full"></span>
            <span style="background: var(--primary-color);" class="inline-block w-3 h-1 mr-1 rounded-full"></span>
            <span style="background: var(--primary-color);" class="inline-block w-1 h-1 mr-1 rounded-full"></span>
        </div>
        <span class="text-md font-semibold text-center text-gray-800 text-center w-full">Choose your appropriate category</span>

        <div class="flex flex-col items-center justify-center gap-3 mt-16">
            <button style="min-width: 173px" class="flex flex-col border rounded-lg items-center px-10 py-4 text-sm font-medium text-gray-600 transition-colors duration-200 sm:text-base gap-x-3 w-full">
                <span>Residental</span>
            </button>

            <button style="min-width: 173px" class="flex flex-col border rounded-lg items-center px-10 py-4 text-sm font-medium text-gray-600 transition-colors duration-200 sm:text-base gap-x-3 w-full">
                <span>Small Commercial</span>
            </button>
        </div>

        <div class="flex flex-row gap-10 border-t absolute w-full left-0 right-0 bottom-0 py-8">
            <button style="border: 2px solid var(--primary-color); color: var(--primary-color);" class="prev-button flex gap-x-3 whitespace-no-wrap text-sm sm:text-base items-center justify-center text-white rounded-md hover:bg-[#1877F2]/80 duration-300 transition-colors border border-transparent py-3 ml-auto w-40">
                <span>Previous</span>
            </button>

            <button class="next-button btn flex gap-x-3 whitespace-no-wrap text-sm sm:text-base items-center justify-center text-white rounded-md hover:bg-[#1877F2]/80 duration-300 transition-colors border border-transparent py-3 mr-auto w-40">
                <span>Next</span>
            </button>
        </div>
    `,
    `
        <div class="flex justify-center mx-auto mb-6 mt-2">
            <span style="background: var(--primary-color);" class="inline-block w-40 h-1 mr-1 rounded-full"></span>
            <span style="background: var(--primary-color);" class="inline-block w-3 h-1 mr-1 rounded-full"></span>
            <span style="background: var(--primary-color);" class="inline-block w-1 h-1 mr-1 rounded-full"></span>
        </div>
        <span class="text-md font-semibold text-center text-gray-800 text-center w-full">Choose your service provider</span>

        <div class="flex flex-col items-center justify-center gap-3 mt-16">
            <button style="min-width: 173px" class="flex flex-col border rounded-lg items-center px-10 py-4 text-sm font-medium text-gray-600 transition-colors duration-200 sm:text-base gap-x-3 w-full">
                <span>AES Ohio</span>
            </button>

            <button style="min-width: 173px" class="flex flex-col border rounded-lg items-center px-10 py-4 text-sm font-medium text-gray-600 transition-colors duration-200 sm:text-base gap-x-3 w-full">
                <span>American Electric Power</span>
            </button>


            <button style="min-width: 173px" class="flex flex-col border rounded-lg items-center px-10 py-4 text-sm font-medium text-gray-600 transition-colors duration-200 sm:text-base gap-x-3 w-full">
                <span>Duke Energy Ohio</span>
            </button>


            <button style="min-width: 173px" class="flex flex-row border rounded-lg items-center px-10 py-4 text-sm font-medium text-gray-600 transition-colors duration-200 sm:text-base gap-x-3 w-full">
                <span style="white-space: nowrap;">American Electric Power</span>

                <svg style="fill: #718096;" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 320 512">
                    <path d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z"/>
                </svg>
            </button>

        </div>

        <div class="bg-white flex flex-row gap-10 border-t absolute w-full left-0 right-0 bottom-0 py-8">
            <button style="border: 2px solid var(--primary-color); color: var(--primary-color);" class="prev-button flex gap-x-3 whitespace-no-wrap text-sm sm:text-base items-center justify-center text-white rounded-md hover:bg-[#1877F2]/80 duration-300 transition-colors border border-transparent py-3 ml-auto w-40">
                <span>Previous</span>
            </button>

            <button class="btn flex gap-x-3 whitespace-no-wrap text-sm sm:text-base items-center justify-center text-white rounded-md hover:bg-[#1877F2]/80 duration-300 transition-colors border border-transparent py-3 mr-auto w-40">
                <span>Next</span>
            </button>
        </div>
    `,
    `
    <div class="question-box card pt-8 pb-2 px-12 rounded-xl relative">
        <div class="w-full px-6 py-8 md:px-8 section" data-section="service-type">
            <div class="flex flex-row gap-4">
                <div class="w-full">
                    <label class="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-200" for="providerName">Service Type</label>
                    <div class="menu-item p-0 relative cursor-pointer transition-colors duration-300 w-full border py-3 pl-4 pr-10">
                        <a class="w-full cursor-default rounded-md bg-white text-left text-sm text-gray-700 ring-1 ring-inset ring-gray-291 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm sm:leading-6 cursor-pointer dropdown-toggle">
                            <p>Gas</p>
                            <span class="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2 rotate-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 text-gray-400 mr-2" viewBox="0 0 512 512">
                                    <path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"></path>
                                </svg>
                            </span>
                        </a>
                        <ol class="sub-menu mt-2" style="width: 245px;">
                            <li class="sub-menu-item text-gray-700 text-sm">
                                Gas
                                <span class="selected-option" style="background-color: hsla(240,83.3%,66.3%,0.15);padding: 5px; border-radius: 50%;">
                                    <svg xmlns="http://www.w3.org/2000/svg" height="0.8em" viewBox="0 0 448 512">
                                        <path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"/>
                                    </svg>
                                </span>
                            </li>
                            <li class="sub-menu-item text-gray-700 text-sm">Electric</li>
                        </ol>
                    </div>
                </div>
                <div class="w-full">
                    <label class="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-200" for="providerName">User Category</label>
                    <div class="menu-item p-0 relative cursor-pointer transition-colors duration-300 w-full border py-3 pl-4 pr-10">
                        <a class="w-full cursor-default rounded-md bg-white text-left text-sm text-gray-700 ring-1 ring-inset ring-gray-291 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm sm:leading-6 cursor-pointer dropdown-toggle">
                            <p>Residental</p>
                            <span class="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2 rotate-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 text-gray-400 mr-2" viewBox="0 0 512 512">
                                    <path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"></path>
                                </svg>
                            </span>
                        </a>
                        <ol class="sub-menu mt-2" style="width: 245px;">
                            <li class="sub-menu-item text-gray-700 text-sm">
                                Residental
                                <span class="selected-option" style="background-color: hsla(240,83.3%,66.3%,0.15);padding: 5px; border-radius: 50%;">
                                    <svg xmlns="http://www.w3.org/2000/svg" height="0.8em" viewBox="0 0 448 512">
                                        <path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"/>
                                    </svg>
                                </span>
                            </li>
                            <li class="sub-menu-item text-gray-700 text-sm">Small Commercial</li>
                            <li class="sub-menu-item text-gray-700 text-sm">Large Commercial/Industrial</li>
                        </ol>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `
];

function showSection(index) {
    const animationDuration = 400; // Adjust this value as needed
    sections.each((i, section) => {
        const direction = i < index ? '-100%' : '100%';
        const opacity = i === index ? 1 : 0;
        
        $(section).animate({
            right: direction,
            opacity: opacity
        }, animationDuration, () => {
            $(section).css('display', i === index ? 'block' : 'none');
            $(section).html(sectionContents[i]);
            $(section).css({
                right: 0,
                opacity: 1
            });
        });
    });
}

function updateURL(sequence) {
    const url = new URL(window.location.href);
    url.searchParams.set('sequence', sequence);
    window.history.replaceState(null, null, url.toString());
}

$(document).ready(() => {
    const sections = $('.section');
    console.log(sections);
    let currentSectionIndex = 0;

    function showSection(index) {
        sections.each((i, section) => {
            $(section).css('display', i === index ? 'flex' : 'none');
        });
    }

    const url = new URL(window.location.href);
    const sequence = url.searchParams.get('sequence');
    if (sequence !== null) {
        currentSectionIndex = parseInt(sequence);
    }

    showSection(currentSectionIndex);

    $(document).on('click', '.next-button', () => {
        currentSectionIndex = Math.min(currentSectionIndex + 1, sections.length - 1);
        updateURL(currentSectionIndex);
        showSection(currentSectionIndex);
    });

    $(document).on('click', '.prev-button', () => {
        currentSectionIndex = Math.max(currentSectionIndex - 1, 0);
        updateURL(currentSectionIndex);
        showSection(currentSectionIndex);
    });

    $(document).on('click', '.choices button', function() {
        $(this).parents('.choices').find('button').removeClass('selected');
        $(this).addClass('selected');
        $(this).parents('.section').find('.next-button').removeClass('disabled');
    })
});

document.addEventListener("DOMContentLoaded", function () {
    // Select all elements with the class 'menu-item'
    const menuItems = document.querySelectorAll('.menu-item');

    menuItems.forEach((menuItem) => {
        // Find the sub-menu and anchor elements within each 'menu-item'
        const subMenu = menuItem.querySelector('.sub-menu');
        const anchor = menuItem.querySelector('.dropdown-toggle p');

        // Add a click event listener to each 'menu-item'
        menuItem.addEventListener('click', () => {
            // Close other open sub-menus when a 'menu-item' is clicked
            menuItems.forEach((otherMenuItem) => {
                if (otherMenuItem !== menuItem) {
                    console.log(otherMenuItem);
                    const otherSubMenu = otherMenuItem.querySelector('.sub-menu');
                    console.log(otherSubMenu);
                    otherSubMenu.classList.remove('open');
                }
            });

            // Toggle the 'open' class on the clicked sub-menu
            subMenu.classList.toggle('open');
        });

        const subMenuItems = menuItem.querySelectorAll('.sub-menu-item');
        subMenuItems.forEach((subMenuItem) => {
            subMenuItem.addEventListener('click', (event) => {
                // Handle the click event on sub-menu items
                const selectedAnchor = event.target;
                if (selectedAnchor) {
                    // Find the clicked option and update the selected text
                    const clickedOption = event.target.parentElement;
                    const selectedOptionSpan = clickedOption.querySelector('.selected-option');
                    
                    if (selectedOptionSpan) {
                        selectedOptionSpan.remove();
                    }
                    selectedAnchor.innerHTML = `${selectedAnchor.textContent}<span class="selected-option" style="background-color: hsla(240,83.3%,66.3%,0.15);padding: 5px; border-radius: 50%;"><svg xmlns="http://www.w3.org/2000/svg" height="0.8em" viewBox="0 0 448 512"><path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c12.5 12.5 12.5 32.8 0 45.3l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"/></svg></span>`;
                    const selectedText = selectedAnchor.textContent;
                    anchor.textContent = selectedText;
                }
            });
        });
    });
});


const creditCardInput = document.getElementById('creditCard');

if (document.getElementById('creditCard') !== null) {
    creditCardInput.addEventListener('input', event => {
        const input = event.target;
        const trimmedValue = input.value.replace(/\s/g, '');
    
        if (isNaN(trimmedValue)) {
            input.value = '';
            return;
        }
    
        const formattedValue = formatCreditCardNumber(trimmedValue);
        input.value = formattedValue;
    });

    function formatCreditCardNumber(value) {
        const groups = value.match(/.{1,4}/g);
        if (groups) {
            return groups.join(' ');
        }
        return value;
    }
    
}


document.addEventListener("DOMContentLoaded", function () {
    const sections = document.querySelectorAll('.section[data-section]');

    sections.forEach(section => {
        const nextButton = section.querySelector('.next-button');
        const requiredInputsInSection = section.querySelectorAll('input.required');
        const agreementCheckbox = section.querySelector('#checkbox');

        requiredInputsInSection.forEach(input => {
            input.addEventListener('input', () => checkRequiredInputs(section, nextButton, agreementCheckbox));
        });

        if (agreementCheckbox) {
            agreementCheckbox.addEventListener('change', () => checkRequiredInputs(section, nextButton, agreementCheckbox));
        }

        checkRequiredInputs(section, nextButton, agreementCheckbox);
    });

    function checkRequiredInputs(section, nextButton, agreementCheckbox) {
        const requiredInputsInSection = section.querySelectorAll('input.required');
        const allInputsFilled = [...requiredInputsInSection].every(input => input.value.trim() !== '');

        let isAgreementChecked = true;
        if (agreementCheckbox) {
            isAgreementChecked = agreementCheckbox.checked;
        }

        if (allInputsFilled && (agreementCheckbox === null || isAgreementChecked)) {
            nextButton.classList.remove('disabled');
        } else {
            nextButton.classList.add('disabled');
        }
    }
});


document.addEventListener("DOMContentLoaded", function () {
    const sections = document.querySelectorAll('.section[data-section]');

    sections.forEach(section => {
        const nextButton = section.querySelector('.next-button');
        const choiceButtons = section.querySelectorAll('.choices button');
        const isCheckboxSection = section.classList.contains('checkbox-section');
        let choiceSelected = false;

        if (isCheckboxSection) {
            const agreementCheckbox = section.querySelector('#checkbox');
            agreementCheckbox.addEventListener('change', () => {
                checkRequiredInputs(nextButton, choiceSelected, agreementCheckbox.checked);
            });
        } else {
            choiceButtons.forEach(button => {
                button.addEventListener('click', () => {
                    choiceButtons.forEach(btn => btn.classList.remove('selected'));
                    button.classList.add('selected');
                    choiceSelected = true;
                    checkRequiredInputs(nextButton, choiceSelected);
                });
            });
        }

        checkRequiredInputs(nextButton, choiceSelected);
    });

    // Enable "Next" button by default in the "service-type" section
    const serviceTypeSection = document.querySelector('.section[data-section="service-type"]');
    if (serviceTypeSection) {
        const defaultNextButton = serviceTypeSection.querySelector('.next-button');
        defaultNextButton.classList.remove('disabled');
    }

    function checkRequiredInputs(nextButton, choiceSelected, agreementChecked = true) {
        if (choiceSelected && agreementChecked) {
            nextButton.classList.remove('disabled');
        } else {
            nextButton.classList.add('disabled');
        }
    }
});



class Slider {
    constructor (rangeElement, valueElement, options) {
      this.rangeElement = rangeElement
      this.valueElement = valueElement
      this.options = options
  
      this.rangeElement.addEventListener('input', this.updateSlider.bind(this))
    }
  
    init() {
      this.rangeElement.setAttribute('min', options.min)
      this.rangeElement.setAttribute('max', options.max)
      this.rangeElement.value = options.cur
  
      this.updateSlider()
    }
  
    // Format the money
    asMoney(value) {
      return parseFloat(value)
        .toLocaleString('en-US', { maximumFractionDigits: 2 })
    }
  
    generateBackground(rangeElement) {   
        if (this.rangeElement.value === this.options.min) {
            return
        }
    
        let percentage =  (this.rangeElement.value - this.options.min) / (this.options.max - this.options.min) * 100
        return 'background: linear-gradient(to right, #50299c, #7a00ff ' + percentage + '%, #d3edff ' + percentage + '%, #dee1e2 100%)'
    }
  
    updateSlider (newValue) {
      this.valueElement.innerHTML = this.asMoney(this.rangeElement.value)
      this.rangeElement.style = this.generateBackground(this.rangeElement.value)
    }
}
  
let rangeElement = document.querySelector('.range [type="range"]')
let valueElement = document.querySelector('.range .range__value span') 

let options = {
    min: 6,
    max: 48,
    cur: 6
}

if (rangeElement) {
    let slider = new Slider(rangeElement, valueElement, options)

    slider.init()
}

// const compareBtn = document.getElementById('compareBtn');
// const modal = document.getElementById('modal');
// const cancelBtn = document.getElementById('cancelBtn');

// compareBtn.addEventListener('click', () => {
//     modal.classList.toggle('disabled');
// });

// cancelBtn.addEventListener('click', () => {
//     modal.classList.add('disabled');
// });

// modal.addEventListener('click', (event) => {
//     if (event.target === modal) {
//         modal.classList.add('disabled');
//     }
// });


const switchBtn = document.getElementById('switchBtn');
const modal = document.getElementById('modal');
const cancelBtn = document.getElementById('cancelBtn');

switchBtn.addEventListener('click', () => {
    modal.classList.toggle('disabled');
});

cancelBtn.addEventListener('click', () => {
    modal.classList.add('disabled');
});

modal.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.classList.add('disabled');
    }
});

const toggleButtons = document.querySelectorAll('.toggle-button');

toggleButtons.forEach(toggleButton => {
    const checkbox = toggleButton.querySelector('.checkbox');

    if (toggleButton) {
        toggleButton.addEventListener('click', () => {
            checkbox.checked = !checkbox.checked;
            toggleButton.style.borderColor = checkbox.checked ? getComputedStyle(document.documentElement).getPropertyValue('--primary-color') : getComputedStyle(document.documentElement).getPropertyValue('--default-border-color');
            toggleButton.style.outlineWidth = checkbox.checked ? '2px' : '';
        });
    }
});

