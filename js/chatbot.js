/* ==========================================================================
   BA AGENCY — Chatbot widget
   Simple rule-based decision tree. No backend, no external AI calls.
   Scheduling -> Calendly popup (host already gets a Calendly email on booking).
   Fallback contact -> pre-filled mailto: to bautistaariza23@gmail.com.
   ========================================================================== */
(function () {
  'use strict';

  var EMAIL = 'bautistaariza23@gmail.com';
  var FORMSUBMIT_ID = 'ce6222dedb5d46e3bd96aee683e071b9';
  var WHATSAPP_URL = 'https://wa.me/5491162626302';
  var LINKEDIN_URL = 'https://www.linkedin.com/in/bautista-ariza-518144189/';
  var CALENDLY_URL = 'https://calendly.com/bautistaariza23/30min';
  var TYPING_DELAY = 500;

  // Íconos de las opciones: Hugeicons stroke rounded (@hugeicons/static
  // 0.1.5), los mismos del resto del sitio. currentColor toma el color del botón.
  var ICONS = {
    services: '<path d="M13.6903 19.4567C13.5 18.9973 13.5 18.4149 13.5 17.25C13.5 16.0851 13.5 15.5027 13.6903 15.0433C13.944 14.4307 14.4307 13.944 15.0433 13.6903C15.5027 13.5 16.0851 13.5 17.25 13.5C18.4149 13.5 18.9973 13.5 19.4567 13.6903C20.0693 13.944 20.556 14.4307 20.8097 15.0433C21 15.5027 21 16.0851 21 17.25C21 18.4149 21 18.9973 20.8097 19.4567C20.556 20.0693 20.0693 20.556 19.4567 20.8097C18.9973 21 18.4149 21 17.25 21C16.0851 21 15.5027 21 15.0433 20.8097C14.4307 20.556 13.944 20.0693 13.6903 19.4567Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="square" stroke-linejoin="round"></path> <path d="M13.6903 8.95671C13.5 8.49728 13.5 7.91485 13.5 6.75C13.5 5.58515 13.5 5.00272 13.6903 4.54329C13.944 3.93072 14.4307 3.44404 15.0433 3.1903C15.5027 3 16.0851 3 17.25 3C18.4149 3 18.9973 3 19.4567 3.1903C20.0693 3.44404 20.556 3.93072 20.8097 4.54329C21 5.00272 21 5.58515 21 6.75C21 7.91485 21 8.49728 20.8097 8.95671C20.556 9.56928 20.0693 10.056 19.4567 10.3097C18.9973 10.5 18.4149 10.5 17.25 10.5C16.0851 10.5 15.5027 10.5 15.0433 10.3097C14.4307 10.056 13.944 9.56928 13.6903 8.95671Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="square" stroke-linejoin="round"></path> <path d="M3.1903 19.4567C3 18.9973 3 18.4149 3 17.25C3 16.0851 3 15.5027 3.1903 15.0433C3.44404 14.4307 3.93072 13.944 4.54329 13.6903C5.00272 13.5 5.58515 13.5 6.75 13.5C7.91485 13.5 8.49728 13.5 8.95671 13.6903C9.56928 13.944 10.056 14.4307 10.3097 15.0433C10.5 15.5027 10.5 16.0851 10.5 17.25C10.5 18.4149 10.5 18.9973 10.3097 19.4567C10.056 20.0693 9.56928 20.556 8.95671 20.8097C8.49728 21 7.91485 21 6.75 21C5.58515 21 5.00272 21 4.54329 20.8097C3.93072 20.556 3.44404 20.0693 3.1903 19.4567Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="square" stroke-linejoin="round"></path> <path d="M3.1903 8.95671C3 8.49728 3 7.91485 3 6.75C3 5.58515 3 5.00272 3.1903 4.54329C3.44404 3.93072 3.93072 3.44404 4.54329 3.1903C5.00272 3 5.58515 3 6.75 3C7.91485 3 8.49728 3 8.95671 3.1903C9.56928 3.44404 10.056 3.93072 10.3097 4.54329C10.5 5.00272 10.5 5.58515 10.5 6.75C10.5 7.91485 10.5 8.49728 10.3097 8.95671C10.056 9.56928 9.56928 10.056 8.95671 10.3097C8.49728 10.5 7.91485 10.5 6.75 10.5C5.58515 10.5 5.00272 10.5 4.54329 10.3097C3.93072 10.056 3.44404 9.56928 3.1903 8.95671Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="square" stroke-linejoin="round"></path>',
    pricing: '<circle cx="1.5" cy="1.5" r="1.5" transform="matrix(1 0 0 -1 16 8.00024)" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></circle> <path d="M2.77423 11.1439C1.77108 12.2643 1.7495 13.9546 2.67016 15.1437C4.49711 17.5033 6.49674 19.5029 8.85633 21.3298C10.0454 22.2505 11.7357 22.2289 12.8561 21.2258C15.8979 18.5022 18.6835 15.6559 21.3719 12.5279C21.6377 12.2187 21.8039 11.8397 21.8412 11.4336C22.0062 9.63798 22.3452 4.46467 20.9403 3.05974C19.5353 1.65481 14.362 1.99377 12.5664 2.15876C12.1603 2.19608 11.7813 2.36233 11.472 2.62811C8.34412 5.31646 5.49781 8.10211 2.77423 11.1439Z" stroke="currentColor" stroke-width="1.5"></path> <path d="M7.00002 14.0002L10 17.0002" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>',
    process: '<path d="M3 4C3 2.34533 3.34533 2 5 2H9C10.6547 2 11 2.34533 11 4C11 5.65467 10.6547 6 9 6H5C3.34533 6 3 5.65467 3 4Z" stroke="currentColor" stroke-width="1.5"></path> <path d="M13 13C13 11.3453 13.3453 11 15 11H19C20.6547 11 21 11.3453 21 13C21 14.6547 20.6547 15 19 15H15C13.3453 15 13 14.6547 13 13Z" stroke="currentColor" stroke-width="1.5"></path> <path d="M4 20C4 18.3453 4.34533 18 6 18H10C11.6547 18 12 18.3453 12 20C12 21.6547 11.6547 22 10 22H6C4.34533 22 4 21.6547 4 20Z" stroke="currentColor" stroke-width="1.5"></path> <path d="M17 11C17 10.5353 17 10.303 16.9616 10.1098C16.8038 9.31644 16.1836 8.69624 15.3902 8.53843C15.197 8.5 14.9647 8.5 14.5 8.5H9.5C9.03534 8.5 8.80302 8.5 8.60982 8.46157C7.81644 8.30376 7.19624 7.68356 7.03843 6.89018C7 6.69698 7 6.46466 7 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M17 15V16C17 17.8856 17 18.8284 16.4142 19.4142C15.8284 20 14.8856 20 13 20H12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>',
    about: '<path d="M17 8.5C17 5.73858 14.7614 3.5 12 3.5C9.23858 3.5 7 5.73858 7 8.5C7 11.2614 9.23858 13.5 12 13.5C14.7614 13.5 17 11.2614 17 8.5Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M19 20.5C19 16.634 15.866 13.5 12 13.5C8.13401 13.5 5 16.634 5 20.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>',
    calendar: '<path d="M16 2V6M8 2V6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M13 4H11C7.22876 4 5.34315 4 4.17157 5.17157C3 6.34315 3 8.22876 3 12V14C3 17.7712 3 19.6569 4.17157 20.8284C5.34315 22 7.22876 22 11 22H13C16.7712 22 18.6569 22 19.8284 20.8284C21 19.6569 21 17.7712 21 14V12C21 8.22876 21 6.34315 19.8284 5.17157C18.6569 4 16.7712 4 13 4Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M3 10H21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M11.9955 14H12.0045M11.9955 18H12.0045M15.991 14H16M8 14H8.00897M8 18H8.00897" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>',
    chat: '<path d="M22 11.5667C22 16.8499 17.5222 21.1334 12 21.1334C11.3507 21.1343 10.7032 21.0742 10.0654 20.9545C9.60633 20.8682 9.37678 20.8251 9.21653 20.8496C9.05627 20.8741 8.82918 20.9948 8.37499 21.2364C7.09014 21.9197 5.59195 22.161 4.15111 21.893C4.69874 21.2194 5.07275 20.4112 5.23778 19.5448C5.33778 19.0148 5.09 18.5 4.71889 18.1231C3.03333 16.4115 2 14.1051 2 11.5667C2 6.28357 6.47778 2 12 2C17.5222 2 22 6.28357 22 11.5667Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"></path> <path d="M11.9955 12H12.0045M15.991 12H16M8 12H8.00897" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>',
    linkedin: '<path d="M4.5 9.5H4C3.05719 9.5 2.58579 9.5 2.29289 9.79289C2 10.0858 2 10.5572 2 11.5V20C2 20.9428 2 21.4142 2.29289 21.7071C2.58579 22 3.05719 22 4 22H4.5C5.44281 22 5.91421 22 6.20711 21.7071C6.5 21.4142 6.5 20.9428 6.5 20V11.5C6.5 10.5572 6.5 10.0858 6.20711 9.79289C5.91421 9.5 5.44281 9.5 4.5 9.5Z" stroke="currentColor" stroke-width="1.5"></path> <path d="M6.5 4.25C6.5 5.49264 5.49264 6.5 4.25 6.5C3.00736 6.5 2 5.49264 2 4.25C2 3.00736 3.00736 2 4.25 2C5.49264 2 6.5 3.00736 6.5 4.25Z" stroke="currentColor" stroke-width="1.5"></path> <path d="M12.326 9.5H11.5C10.5572 9.5 10.0858 9.5 9.79289 9.79289C9.5 10.0858 9.5 10.5572 9.5 11.5V20C9.5 20.9428 9.5 21.4142 9.79289 21.7071C10.0858 22 10.5572 22 11.5 22H12C12.9428 22 13.4142 22 13.7071 21.7071C14 21.4142 14 20.9428 14 20L14.0001 16.5001C14.0001 14.8433 14.5281 13.5001 16.0879 13.5001C16.8677 13.5001 17.5 14.1717 17.5 15.0001V19.5001C17.5 20.4429 17.5 20.9143 17.7929 21.2072C18.0857 21.5001 18.5572 21.5001 19.5 21.5001H19.9987C20.9413 21.5001 21.4126 21.5001 21.7055 21.2073C21.9984 20.9145 21.9985 20.4432 21.9987 19.5006L22.0001 14.0002C22.0001 11.515 19.6364 9.50024 17.2968 9.50024C15.9649 9.50024 14.7767 10.1531 14.0001 11.174C14 10.5439 14 10.2289 13.8632 9.995C13.7765 9.84686 13.6531 9.72353 13.505 9.63687C13.2711 9.5 12.9561 9.5 12.326 9.5Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"></path>',
    whatsapp: '<path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 13.3789 2.27907 14.6926 2.78382 15.8877C3.06278 16.5481 3.20226 16.8784 3.21953 17.128C3.2368 17.3776 3.16334 17.6521 3.01642 18.2012L2 22L5.79877 20.9836C6.34788 20.8367 6.62244 20.7632 6.87202 20.7805C7.12161 20.7977 7.45185 20.9372 8.11235 21.2162C9.30745 21.7209 10.6211 22 12 22Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"></path> <path d="M8.58815 12.3773L9.45909 11.2956C9.82616 10.8397 10.2799 10.4153 10.3155 9.80826C10.3244 9.65494 10.2166 8.96657 10.0008 7.58986C9.91601 7.04881 9.41086 7 8.97332 7C8.40314 7 8.11805 7 7.83495 7.12931C7.47714 7.29275 7.10979 7.75231 7.02917 8.13733C6.96539 8.44196 7.01279 8.65187 7.10759 9.07169C7.51023 10.8548 8.45481 12.6158 9.91948 14.0805C11.3842 15.5452 13.1452 16.4898 14.9283 16.8924C15.3481 16.9872 15.558 17.0346 15.8627 16.9708C16.2477 16.8902 16.7072 16.5229 16.8707 16.165C17 15.8819 17 15.5969 17 15.0267C17 14.5891 16.9512 14.084 16.4101 13.9992C15.0334 13.7834 14.3451 13.6756 14.1917 13.6845C13.5847 13.7201 13.1603 14.1738 12.7044 14.5409L11.6227 15.4118" stroke="currentColor" stroke-width="1.5"></path>',
    mail: '<path d="M2 6L8.91302 9.91697C11.4616 11.361 12.5384 11.361 15.087 9.91697L22 6" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"></path> <path d="M2.01577 13.4756C2.08114 16.5412 2.11383 18.0739 3.24496 19.2094C4.37608 20.3448 5.95033 20.3843 9.09883 20.4634C11.0393 20.5122 12.9607 20.5122 14.9012 20.4634C18.0497 20.3843 19.6239 20.3448 20.7551 19.2094C21.8862 18.0739 21.9189 16.5412 21.9842 13.4756C22.0053 12.4899 22.0053 11.5101 21.9842 10.5244C21.9189 7.45886 21.8862 5.92609 20.7551 4.79066C19.6239 3.65523 18.0497 3.61568 14.9012 3.53657C12.9607 3.48781 11.0393 3.48781 9.09882 3.53656C5.95033 3.61566 4.37608 3.65521 3.24495 4.79065C2.11382 5.92608 2.08114 7.45885 2.01576 10.5244C1.99474 11.5101 1.99475 12.4899 2.01577 13.4756Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"></path>',
    edit: '<path d="M15.2141 5.98239L16.6158 4.58063C17.39 3.80646 18.6452 3.80646 19.4194 4.58063C20.1935 5.3548 20.1935 6.60998 19.4194 7.38415L18.0176 8.78591M15.2141 5.98239L6.98023 14.2163C5.93493 15.2616 5.41226 15.7842 5.05637 16.4211C4.70047 17.058 4.3424 18.5619 4 20C5.43809 19.6576 6.94199 19.2995 7.57889 18.9436C8.21579 18.5877 8.73844 18.0651 9.78375 17.0198L18.0176 8.78591M15.2141 5.98239L18.0176 8.78591" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M11 20H17" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"></path>',
    back: '<path d="M15 6C15 6 9.00001 10.4189 9 12C8.99999 13.5812 15 18 15 18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>',
    chevron: '<path d="M9.00005 6C9.00005 6 15 10.4189 15 12C15 13.5812 9 18 9 18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>',
    landing: '<path d="M2.5 12C2.5 7.52166 2.5 5.28249 3.89124 3.89124C5.28249 2.5 7.52166 2.5 12 2.5C16.4783 2.5 18.7175 2.5 20.1088 3.89124C21.5 5.28249 21.5 7.52166 21.5 12C21.5 16.4783 21.5 18.7175 20.1088 20.1088C18.7175 21.5 16.4783 21.5 12 21.5C7.52166 21.5 5.28249 21.5 3.89124 20.1088C2.5 18.7175 2.5 16.4783 2.5 12Z" stroke="currentColor" stroke-width="1.5"></path> <path d="M2.5 9H21.5" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"></path> <path d="M6.99981 6H7.00879" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M10.9998 6H11.0088" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>',
    corp: '<circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5"></circle> <path d="M8 12C8 18 12 22 12 22C12 22 16 18 16 12C16 6 12 2 12 2C12 2 8 6 8 12Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"></path> <path d="M21 15H3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M21 9H3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>',
    ecom: '<path d="M8 16H15.2632C19.7508 16 20.4333 13.1808 21.261 9.06908C21.4998 7.88311 21.6192 7.29013 21.3321 6.89507C21.045 6.5 20.4947 6.5 19.3941 6.5H6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"></path> <path d="M8 16L5.37873 3.51493C5.15615 2.62459 4.35618 2 3.43845 2H2.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"></path> <path d="M8.88 16H8.46857C7.10522 16 6 17.1513 6 18.5714C6 18.8081 6.1842 19 6.41143 19H17.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> <circle cx="10.5" cy="20.5" r="1.5" stroke="currentColor" stroke-width="1.5"></circle> <circle cx="17.5" cy="20.5" r="1.5" stroke="currentColor" stroke-width="1.5"></circle>',
    ai: '<path d="M21.25 5.5C20.8358 5.5 20.5 5.16421 20.5 4.75C20.5 4.33579 20.8358 4 21.25 4C21.6642 4 22 4.33579 22 4.75C22 5.16421 21.6642 5.5 21.25 5.5ZM21.25 5.5V9.25C21.25 9.94778 21.25 10.2967 21.1639 10.5806C20.97 11.2198 20.4698 11.72 19.8306 11.9139C19.5467 12 19.1978 12 18.5 12" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"></path> <path d="M2.75 18.5C3.16421 18.5 3.5 18.8358 3.5 19.25C3.5 19.6642 3.16421 20 2.75 20C2.33579 20 2 19.6642 2 19.25C2 18.8358 2.33579 18.5 2.75 18.5ZM2.75 18.5L2.75 14.75C2.75 14.0522 2.75 13.7033 2.83612 13.4194C3.03002 12.7802 3.53023 12.28 4.16943 12.0861C4.45333 12 4.80222 12 5.5 12" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"></path> <path d="M5.5 2.75009C5.5 3.16431 5.16421 3.50009 4.75 3.50009C4.33579 3.50009 4 3.16431 4 2.75009C4 2.33588 4.33579 2.00009 4.75 2.00009C5.16421 2.00009 5.5 2.33588 5.5 2.75009ZM5.5 2.75009L9.25 2.75009C9.94778 2.75009 10.2967 2.75009 10.5806 2.83621C11.2198 3.03011 11.72 3.53032 11.9139 4.16952C12 4.45342 12 4.80231 12 5.50009" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"></path> <path d="M18.5 21.2501C18.5 20.8359 18.8358 20.5001 19.25 20.5001C19.6642 20.5001 20 20.8359 20 21.2501C20 21.6643 19.6642 22.0001 19.25 22.0001C18.8358 22.0001 18.5 21.6643 18.5 21.2501ZM18.5 21.2501L14.75 21.2501C14.0522 21.2501 13.7033 21.2501 13.4194 21.164C12.7802 20.9701 12.28 20.4699 12.0861 19.8307C12 19.5468 12 19.1979 12 18.5001" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"></path> <path d="M5.54883 11.9512C5.54883 8.88704 5.54883 7.35498 6.50073 6.40307C7.45263 5.45117 8.9847 5.45117 12.0488 5.45117C15.113 5.45117 16.645 5.45117 17.5969 6.40307C18.5488 7.35498 18.5488 8.88704 18.5488 11.9512C18.5488 15.0153 18.5488 16.5474 17.5969 17.4993C16.645 18.4512 15.113 18.4512 12.0488 18.4512C8.9847 18.4512 7.45263 18.4512 6.50073 17.4993C5.54883 16.5474 5.54883 15.0153 5.54883 11.9512Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"></path> <path d="M12.499 14.5L11.0384 9.97891C10.9465 9.69466 10.6648 9.5 10.3452 9.5C10.0256 9.5 9.74382 9.69466 9.65199 9.97891L8.19133 14.5M14.9989 9.5V14.5M8.72979 13H11.9606" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>'
  };

  function icon(name, cls) {
    return '<svg class="' + cls + '" width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">' + ICONS[name] + '</svg>';
  }

  function bi(es, en) {
    return '<span class="lang-es">' + es + '</span><span class="lang-en">' + en + '</span>';
  }

  function isEN() {
    return wrap.getAttribute('data-lang') === 'en';
  }

  // ---- Screen tree ------------------------------------------------------
  var SCREENS = {
    root: {
      bubbles: [
        bi('¡Hola! 👋 Soy <strong>BautistAI</strong>, el asistente de Bautista.', "Hi! 👋 I'm <strong>BautistAI</strong>, Bautista's assistant."),
        bi('¿En qué puedo ayudarte? Puedo contarte sobre mis servicios, precios, cómo trabajo, o ayudarte a agendar una llamada.', "How can I help you? I can tell you about my services, pricing, how I work, or help you book a call.")
      ],
      options: [
        { label: bi('Servicios', 'Services'), to: 'servicios', icon: 'services' },
        { label: bi('Precios', 'Pricing'), to: 'precios', icon: 'pricing' },
        { label: bi('Cómo trabajo', 'How I work'), to: 'proceso', icon: 'process' },
        { label: bi('Sobre Bautista', 'About Bautista'), to: 'sobre', icon: 'about' },
        { label: bi('Agendar una llamada', 'Book a call'), to: 'agendar', icon: 'calendar', primary: true },
        { label: bi('Hablar directo', 'Contact directly'), to: 'contacto', icon: 'chat' }
      ]
    },

    servicios: {
      bubbles: [bi('Estos son los servicios que ofrezco:', 'Here are the services I offer:')],
      options: [
        { label: bi('Landing pages', 'Landing pages'), to: 'svc-landing', icon: 'landing' },
        { label: bi('Sitios corporativos', 'Corporate websites'), to: 'svc-corp', icon: 'corp' },
        { label: bi('E-commerce', 'E-commerce'), to: 'svc-ecom', icon: 'ecom' },
        { label: bi('Automatización con IA', 'AI automation'), to: 'svc-auto', icon: 'ai' },
        { label: bi('Menú principal', 'Main menu'), to: 'root', icon: 'back' }
      ]
    },
    'svc-landing': {
      bubbles: [bi(
        '<span class="ba-msg-strong">Landing pages</span><br>Una sola página pensada para una sola acción: que tu visitante haga clic. Mensaje claro, CTA visible y carga instantánea.',
        '<span class="ba-msg-strong">Landing pages</span><br>A single page built for a single action: getting your visitor to click. Clear message, visible CTA, instant load.'
      )],
      options: 'svcFollow'
    },
    'svc-corp': {
      bubbles: [bi(
        '<span class="ba-msg-strong">Sitios web corporativos</span><br>Tu presencia digital completa. Diseño en Figma, desarrollo en Framer o en código (HTML, CSS, JS, Tailwind CSS) según lo que tu proyecto necesite.',
        '<span class="ba-msg-strong">Corporate websites</span><br>Your complete digital presence. Designed in Figma, built in Framer or in code (HTML, CSS, JS, Tailwind CSS) — whichever your project needs.'
      )],
      options: 'svcFollow'
    },
    'svc-ecom': {
      bubbles: [bi(
        '<span class="ba-msg-strong">E-commerce</span><br>Tu tienda desde cero en Shopify o Tienda Nube. Lista para vender, con medios de pago configurados y experiencia de compra optimizada.',
        '<span class="ba-msg-strong">E-commerce</span><br>Your store from scratch on Shopify or Tienda Nube. Ready to sell, with payments configured and an optimized buying experience.'
      )],
      options: 'svcFollow'
    },
    'svc-auto': {
      bubbles: [bi(
        '<span class="ba-msg-strong">Automatización con IA</span><br>Flujos creados con IA que agilizan y resuelven rápidamente los objetivos de tus usuarios en tu negocio.',
        "<span class=\"ba-msg-strong\">AI automation</span><br>AI-built workflows that streamline your business and solve your users' goals fast."
      )],
      options: 'svcFollow'
    },

    precios: {
      bubbles: [
        bi('Elegí la opción que mejor se adapta a lo que tenés en mente — esto me ayuda a preparar una propuesta que tenga sentido para vos:', 'Pick the option that best fits what you have in mind — it helps me prepare a proposal that makes sense for you:'),
        bi(
          '<ul>' +
            '<li><span class="ba-msg-strong">Nuevo proyecto</span> — desde $600 USD. Diseño + desarrollo de punta a punta, 6 revisiones + CMS + SEO.</li>' +
            '<li><span class="ba-msg-strong">Tienda online</span> — desde $500 USD. Shopify o Tienda Nube, lista para vender.</li>' +
            '<li><span class="ba-msg-strong">Desarrollo a medida</span> — desde $400 USD. Si ya tenés el diseño en Figma, 4 revisiones + CMS.</li>' +
            '<li><span class="ba-msg-strong">Automatización</span> — desde $350 USD. Flujos de automatización con IA.</li>' +
            '<li><span class="ba-msg-strong">Landing page</span> — desde $250 USD. Figma + Framer o desarrollo en código, 4 revisiones.</li>' +
          '</ul>',
          '<ul>' +
            '<li><span class="ba-msg-strong">New project</span> — from $600 USD. End-to-end design + build, 6 revisions + CMS + SEO.</li>' +
            '<li><span class="ba-msg-strong">Online store</span> — from $500 USD. Shopify or Tienda Nube, ready to sell.</li>' +
            '<li><span class="ba-msg-strong">Custom development</span> — from $400 USD. If you already have the Figma design, 4 revisions + CMS.</li>' +
            '<li><span class="ba-msg-strong">Automation</span> — from $350 USD. AI automation workflows.</li>' +
            '<li><span class="ba-msg-strong">Landing page</span> — from $250 USD. Figma + Framer or code development, 4 revisions.</li>' +
          '</ul>'
        ),
        bi('Los precios son un punto de partida: la propuesta final depende del alcance del proyecto.', 'Prices are a starting point — the final quote depends on project scope.')
      ],
      options: [
        { label: bi('Agendar una llamada', 'Book a call'), to: 'agendar', icon: 'calendar', primary: true },
        { label: bi('Ver servicios', 'See services'), to: 'servicios', icon: 'services' },
        { label: bi('Menú principal', 'Main menu'), to: 'root', icon: 'back' }
      ]
    },

    proceso: {
      bubbles: [
        bi('Trabajo en <span class="ba-msg-strong">tres pasos</span>, en unas <span class="ba-msg-strong">dos semanas</span>:', 'I work in <span class="ba-msg-strong">three steps</span>, over about <span class="ba-msg-strong">two weeks</span>:'),
        bi(
          '<ul>' +
            '<li><span class="ba-msg-strong">Día 1–3 · Entiendo tu negocio</span> — una llamada de 45 minutos para entender a tus clientes y objetivos.</li>' +
            '<li><span class="ba-msg-strong">Día 4–11 · Construyo la solución</span> — diseño en Figma y desarrollo en Framer o en código. Ves el avance en tiempo real.</li>' +
            '<li><span class="ba-msg-strong">Día 11–14 · Tu sitio sale al mundo</span> — revisamos juntos, ajustamos detalles y publicamos.</li>' +
          '</ul>',
          '<ul>' +
            '<li><span class="ba-msg-strong">Day 1–3 · I learn your business</span> — a 45-minute call to understand your clients and goals.</li>' +
            '<li><span class="ba-msg-strong">Day 4–11 · I build the solution</span> — Figma design and development in Framer or in code. You see progress in real time.</li>' +
            '<li><span class="ba-msg-strong">Day 11–14 · Your site goes live</span> — we review together, fine-tune details and publish.</li>' +
          '</ul>'
        )
      ],
      options: [
        { label: bi('Agendar una llamada', 'Book a call'), to: 'agendar', icon: 'calendar', primary: true },
        { label: bi('Menú principal', 'Main menu'), to: 'root', icon: 'back' }
      ]
    },

    sobre: {
      bubbles: [
        bi(
          'Soy Bautista, diseñador UX/UI, desarrollador web y creador de flujos de automatización con IA. Trabajo con emprendedores y negocios que necesitan un sitio desde cero, y con quienes ya tienen uno pero está confuso, lento o desactualizado — no hago solo sitios bonitos, hago sitios que funcionan.',
          "I'm Bautista, a UX/UI designer, web developer and AI automation workflow creator. I work with entrepreneurs and businesses that need a site from scratch, and with those who already have one but it's confusing, slow or outdated — I don't make pretty sites, I make sites that work."
        ),
        bi('Con base en Buenos Aires, Argentina 🇦🇷', 'Based in Buenos Aires, Argentina 🇦🇷')
      ],
      options: [
        { label: bi('Agendar una llamada', 'Book a call'), to: 'agendar', icon: 'calendar', primary: true },
        { label: bi('Ver LinkedIn', 'See LinkedIn'), to: 'contacto-li', icon: 'linkedin' },
        { label: bi('Menú principal', 'Main menu'), to: 'root', icon: 'back' }
      ]
    },

    agendar: {
      bubbles: [bi(
        'Puedo ayudarte a reservar una <span class="ba-msg-strong">llamada de 45 minutos</span> directo en mi calendario. ¿Cómo preferís seguir?',
        'I can help you book a <span class="ba-msg-strong">45-minute call</span> directly on my calendar. How would you like to continue?'
      )],
      options: [
        { label: bi('Elegir día y hora', 'Pick a day & time'), to: 'agendar-calendly', icon: 'calendar', primary: true },
        { label: bi('Prefiero dejar mis datos', 'I\'d rather leave my info'), to: 'agendar-form', icon: 'edit' },
        { label: bi('Menú principal', 'Main menu'), to: 'root', icon: 'back' }
      ]
    },
    'agendar-calendly': {
      bubbles: [bi(
        'Abriendo mi calendario para que elijas el día y horario que prefieras. Al confirmar, me llega la reunión directo por correo. 📬',
        'Opening my calendar so you can pick your preferred day and time. Once confirmed, I get the meeting straight to my email. 📬'
      )],
      onEnter: function () { openCalendly(); },
      options: [
        { label: bi('Prefiero dejar mis datos', "I'd rather leave my info"), to: 'agendar-form', icon: 'edit' },
        { label: bi('Menú principal', 'Main menu'), to: 'root', icon: 'back' }
      ]
    },
    'agendar-form': {
      bubbles: [bi(
        'Dejame tu nombre, email y un mensaje breve — se lo hago llegar a Bautista por correo:',
        "Leave me your name, email and a short message — I'll get it to Bautista by email:"
      )],
      options: [],
      onEnter: function () { showContactForm(); }
    },
    'agendar-form-sent': {
      bubbles: [
        bi('¡Listo! Tu mensaje llegó directo a mi correo. Te respondo en menos de 24 horas. 📨', 'All set! Your message went straight to my inbox. I\'ll reply within 24 hours. 📨')
      ],
      options: [
        { label: bi('Menú principal', 'Main menu'), to: 'root', icon: 'back' }
      ]
    },
    'agendar-form-error': {
      bubbles: [
        bi('No pude enviarlo automáticamente, pero se abrió tu cliente de correo con el mensaje listo — solo tenés que darle enviar. Si tampoco se abrió, escribinos directo a <strong>' + EMAIL + '</strong>.', "I couldn't send it automatically, but your email client opened with the message ready — just hit send. If that didn't open either, write to us directly at <strong>" + EMAIL + '</strong>.')
      ],
      options: [
        { label: bi('Menú principal', 'Main menu'), to: 'root', icon: 'back' }
      ]
    },

    contacto: {
      bubbles: [bi('Podés escribirle directo a Bautista por:', 'You can reach Bautista directly via:')],
      options: [
        { label: bi('WhatsApp', 'WhatsApp'), to: 'contacto-wa', icon: 'whatsapp', primary: true },
        { label: bi('Email', 'Email'), to: 'contacto-email', icon: 'mail' },
        { label: bi('LinkedIn', 'LinkedIn'), to: 'contacto-li', icon: 'linkedin' },
        { label: bi('Menú principal', 'Main menu'), to: 'root', icon: 'back' }
      ]
    },
    'contacto-wa': {
      bubbles: [bi('Se abrió WhatsApp en una pestaña nueva 🟢', 'WhatsApp opened in a new tab 🟢')],
      onEnter: function () { window.open(WHATSAPP_URL, '_blank', 'noopener'); },
      options: 'contactoFollow'
    },
    'contacto-email': {
      bubbles: [bi('Se abrió tu cliente de correo, listo para escribirle a Bautista ✉️', 'Your email client opened, ready to write to Bautista ✉️')],
      onEnter: function () { window.location.href = 'mailto:' + EMAIL; },
      options: 'contactoFollow'
    },
    'contacto-li': {
      bubbles: [bi('Se abrió el LinkedIn de Bautista en una pestaña nueva 💼', "Bautista's LinkedIn opened in a new tab 💼")],
      onEnter: function () { window.open(LINKEDIN_URL, '_blank', 'noopener'); },
      options: 'contactoFollow'
    }
  };

  var SHARED_OPTIONS = {
    svcFollow: [
      { label: bi('Agendar sobre esto', 'Book about this'), to: 'agendar', icon: 'calendar', primary: true },
      { label: bi('Ver otro servicio', 'See another service'), to: 'servicios', icon: 'services' },
      { label: bi('Menú principal', 'Main menu'), to: 'root', icon: 'back' }
    ],
    contactoFollow: [
      { label: bi('Agendar una llamada', 'Book a call'), to: 'agendar', icon: 'calendar', primary: true },
      { label: bi('Menú principal', 'Main menu'), to: 'root', icon: 'back' }
    ]
  };

  // Resolve string option-set references to arrays
  Object.keys(SCREENS).forEach(function (k) {
    if (typeof SCREENS[k].options === 'string') {
      SCREENS[k].options = SHARED_OPTIONS[SCREENS[k].options];
    }
  });

  // ---- DOM build ----------------------------------------------------------
  // Appended as a sibling of the site's <x-dc> app root (not inside it) so the
  // site's own re-render/diffing never touches or wipes the widget.
  var wrap = document.createElement('div');
  wrap.id = 'ba-chat';
  wrap.innerHTML =
    '<div id="ba-chat-teaser" class="ba-chat-hidden">' +
      '<button type="button" id="ba-chat-teaser-close" aria-label="Cerrar">✕</button>' +
      bi('¿Tenés dudas sobre tu proyecto? Preguntame 👋', 'Have questions about your project? Ask me 👋') +
    '</div>' +
    '<div id="ba-chat-panel" role="dialog" aria-label="Chat">' +
      '<div id="ba-chat-header">' +
        '<img src="assets/img/logo.png" alt="">' +
        '<div>' +
          '<p class="ba-chat-title">BautistAI</p>' +
          '<p class="ba-chat-status"><i></i>' + bi('Asistente virtual', 'Virtual assistant') + '</p>' +
        '</div>' +
        '<div id="ba-chat-header-actions">' +
          '<button type="button" id="ba-chat-restart" title="Reiniciar" aria-label="Reiniciar">' +
            '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-3-6.7"></path><path d="M21 3v6h-6"></path></svg>' +
          '</button>' +
          '<button type="button" id="ba-chat-close" title="Cerrar" aria-label="Cerrar">' +
            '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"></path><path d="M6 6l12 12"></path></svg>' +
          '</button>' +
        '</div>' +
      '</div>' +
      '<div id="ba-chat-messages"></div>' +
      '<div id="ba-chat-options"></div>' +
      '<form id="ba-chat-form" novalidate>' +
        '<div class="hp-field" aria-hidden="true"><input id="ba-chat-hp" type="text" tabindex="-1" autocomplete="off"></div>' +
        '<div class="ba-chat-field"><label for="ba-chat-name">' + bi('Nombre', 'Name') + '</label><input id="ba-chat-name" type="text" autocomplete="name" required></div>' +
        '<div class="ba-chat-field"><label for="ba-chat-email">Email</label><input id="ba-chat-email" type="email" autocomplete="email" required></div>' +
        '<div class="ba-chat-field"><label for="ba-chat-message">' + bi('Mensaje', 'Message') + '</label><textarea id="ba-chat-message" rows="3" required></textarea></div>' +
        '<p id="ba-chat-form-error">' + bi('Completá tu nombre, un email válido y un mensaje.', 'Please fill in your name, a valid email and a message.') + '</p>' +
        '<div class="ba-chat-form-actions">' +
          '<button type="button" id="ba-chat-form-cancel" class="ba-chat-opt">' + bi('Cancelar', 'Cancel') + '</button>' +
          '<button type="submit" id="ba-chat-form-submit" class="ba-chat-opt ba-chat-opt-primary">' + bi('Enviar', 'Send') + '</button>' +
        '</div>' +
      '</form>' +
      '<footer id="ba-chat-footer"><p>' + bi('Respuesta en menos de 24 horas.', 'Reply within 24 hours.') + '</p></footer>' +
    '</div>' +
    '<button type="button" id="ba-chat-toggle" aria-label="Abrir chat" aria-expanded="false">' +
      '<span id="ba-chat-badge" aria-hidden="true">1</span>' +
      '<svg class="ba-chat-icon-open" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>' +
      '<svg class="ba-chat-icon-close" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"></path><path d="M6 6l12 12"></path></svg>' +
    '</button>';
  document.body.appendChild(wrap);

  // The site's framework replaces the [data-lang] node on re-render (e.g. on
  // every toggle), which would orphan a MutationObserver bound to one node
  // instance. Re-querying on a light interval is what actually stays in sync.
  function syncLang() {
    var site = document.querySelector('[data-lang]');
    var val = site && site.getAttribute('data-lang');
    var next = val === 'en' ? 'en' : 'es';
    if (wrap.getAttribute('data-lang') !== next) wrap.setAttribute('data-lang', next);
  }
  syncLang();
  setInterval(syncLang, 400);

  var messagesEl = wrap.querySelector('#ba-chat-messages');
  var optionsEl = wrap.querySelector('#ba-chat-options');
  var formEl = wrap.querySelector('#ba-chat-form');
  var nameInput = wrap.querySelector('#ba-chat-name');
  var emailInput = wrap.querySelector('#ba-chat-email');
  var msgInput = wrap.querySelector('#ba-chat-message');
  var formError = wrap.querySelector('#ba-chat-form-error');
  var teaser = wrap.querySelector('#ba-chat-teaser');

  var state = { current: null, started: false };

  function appendBotMsg(html) {
    var el = document.createElement('div');
    el.className = 'ba-msg ba-msg-bot';
    el.innerHTML = html;
    messagesEl.appendChild(el);
    scrollBottom();
  }
  function appendUserMsg(html) {
    var el = document.createElement('div');
    el.className = 'ba-msg ba-msg-user';
    el.innerHTML = html;
    messagesEl.appendChild(el);
    scrollBottom();
  }
  function scrollBottom() {
    requestAnimationFrame(function () { messagesEl.scrollTop = messagesEl.scrollHeight; });
  }
  function showTyping() {
    var el = document.createElement('div');
    el.className = 'ba-typing';
    el.id = 'ba-chat-typing';
    el.innerHTML = '<span></span><span></span><span></span>';
    messagesEl.appendChild(el);
    scrollBottom();
  }
  function hideTyping() {
    var el = document.getElementById('ba-chat-typing');
    if (el) el.remove();
  }
  function clearOptions() { optionsEl.innerHTML = ''; }
  function hideForm() { formEl.classList.remove('ba-chat-form-open'); formError.style.display = 'none'; }

  // Opciones agrupadas por rol, para que no se vean como una pila de botones:
  // - Las secundarias forman una lista tipo menú (ícono, texto y flecha).
  // - La principal (primary) es un botón de acción a lo ancho, debajo.
  // - "Menú principal" es un enlace discreto para volver, al final.
  function renderOptions(options) {
    clearOptions();
    var list = (options || []);
    var menu = null;

    function makeButton(opt, cls, inner) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = cls;
      btn.innerHTML = inner;
      btn.addEventListener('click', function () {
        var picked = isEN() ? extractLang(opt.label, 'en') : extractLang(opt.label, 'es');
        clearOptions();
        goTo(opt.to, picked);
      });
      return btn;
    }

    list.forEach(function (opt) {
      if (opt.primary || opt.icon === 'back') return;
      if (!menu) {
        menu = document.createElement('div');
        menu.className = 'ba-chat-menu';
        optionsEl.appendChild(menu);
      }
      var lead = opt.icon ? '<span class="ba-chat-row-icon">' + icon(opt.icon, '') + '</span>' : '';
      menu.appendChild(makeButton(opt, 'ba-chat-row',
        lead + '<span class="ba-chat-row-label">' + opt.label + '</span>' + icon('chevron', 'ba-chat-row-chevron')));
    });

    list.forEach(function (opt) {
      if (!opt.primary) return;
      var lead = opt.icon ? icon(opt.icon, 'ba-chat-cta-icon') : '';
      optionsEl.appendChild(makeButton(opt, 'ba-chat-cta', lead + '<span>' + opt.label + '</span>'));
    });

    list.forEach(function (opt) {
      if (opt.icon !== 'back') return;
      optionsEl.appendChild(makeButton(opt, 'ba-chat-back', icon('back', '') + '<span>' + opt.label + '</span>'));
    });
  }

  function extractLang(html, lang) {
    var tmp = document.createElement('div');
    tmp.innerHTML = html;
    var span = tmp.querySelector('.lang-' + lang);
    return span ? span.innerHTML : html;
  }

  function goTo(id, userLabelHtml) {
    if (userLabelHtml) appendUserMsg(userLabelHtml);
    hideForm();
    showTyping();
    setTimeout(function () {
      hideTyping();
      var node = SCREENS[id];
      if (!node) return;
      node.bubbles.forEach(appendBotMsg);
      if (node.options && node.options.length) {
        renderOptions(node.options);
      } else {
        clearOptions();
      }
      state.current = id;
      if (node.onEnter) node.onEnter();
      scrollBottom();
    }, TYPING_DELAY);
  }

  // ---- Contact form fallback ----------------------------------------------
  function showContactForm() {
    clearOptions();
    formEl.classList.add('ba-chat-form-open');
    nameInput.value = '';
    emailInput.value = '';
    msgInput.value = '';
    formError.style.display = 'none';
    setTimeout(function () { nameInput.focus(); }, 100);
  }

  formEl.addEventListener('submit', function (e) {
    e.preventDefault();
    var name = nameInput.value.trim();
    var email = emailInput.value.trim();
    var message = msgInput.value.trim();
    var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!name || !emailOk || !message) {
      formError.style.display = 'block';
      return;
    }
    formError.style.display = 'none';
    var submitBtn = wrap.querySelector('#ba-chat-form-submit');
    submitBtn.disabled = true;

    fetch('https://formsubmit.co/ajax/' + FORMSUBMIT_ID, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ _subject: 'Consulta desde el chatbot – ' + name, _honey: wrap.querySelector('#ba-chat-hp').value, Nombre: name, Correo: email, Mensaje: message })
    }).then(function (r) { return r.json(); }).then(function (res) {
      submitBtn.disabled = false;
      if (res && (res.success === 'true' || res.success === true)) {
        hideForm();
        goTo('agendar-form-sent');
      } else {
        throw new Error('send failed');
      }
    }).catch(function () {
      submitBtn.disabled = false;
      var subject = 'Consulta desde el chatbot – ' + name;
      var body = 'Nombre: ' + name + '\nEmail: ' + email + '\n\nMensaje:\n' + message;
      window.location.href = 'mailto:' + EMAIL + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
      hideForm();
      goTo('agendar-form-error');
    });
  });

  wrap.querySelector('#ba-chat-form-cancel').addEventListener('click', function () {
    goTo('agendar');
  });

  // ---- Calendly (lazy-loaded) ---------------------------------------------
  var calendlyReady = false;
  function ensureCalendlyAssets(cb) {
    if (calendlyReady && window.Calendly) { cb(); return; }
    if (!document.getElementById('ba-calendly-css')) {
      var link = document.createElement('link');
      link.id = 'ba-calendly-css';
      link.rel = 'stylesheet';
      link.href = 'https://assets.calendly.com/assets/external/widget.css';
      document.head.appendChild(link);
    }
    var existing = document.getElementById('ba-calendly-js');
    if (existing) {
      existing.addEventListener('load', function () { calendlyReady = true; cb(); });
      return;
    }
    var script = document.createElement('script');
    script.id = 'ba-calendly-js';
    script.src = 'https://assets.calendly.com/assets/external/widget.js';
    script.async = true;
    script.onload = function () { calendlyReady = true; cb(); };
    document.head.appendChild(script);
  }
  function openCalendly() {
    ensureCalendlyAssets(function () {
      if (window.Calendly) window.Calendly.initPopupWidget({ url: CALENDLY_URL });
    });
  }

  // ---- Toggle / teaser -----------------------------------------------------
  var toggleBtn = wrap.querySelector('#ba-chat-toggle');
  var closeBtn = wrap.querySelector('#ba-chat-close');
  var restartBtn = wrap.querySelector('#ba-chat-restart');
  var teaserClose = wrap.querySelector('#ba-chat-teaser-close');

  function openChat() {
    wrap.classList.add('ba-chat-open');
    toggleBtn.setAttribute('aria-expanded', 'true');
    dismissTeaser();
    markEngaged();
    if (!state.started) { state.started = true; goTo('root'); }
  }
  function closeChat() {
    wrap.classList.remove('ba-chat-open');
    toggleBtn.setAttribute('aria-expanded', 'false');
  }
  function dismissTeaser() {
    teaser.classList.add('ba-chat-hidden');
    try { localStorage.setItem('baChatTeaserSeen', '1'); } catch (e) {}
  }
  // Retires the launcher's attention cues (halo + unread badge) for good once
  // the visitor has actually opened the chat.
  function markEngaged() {
    wrap.classList.add('ba-chat-engaged');
    try { localStorage.setItem('baChatEngaged', '1'); } catch (e) {}
  }

  toggleBtn.addEventListener('click', function () {
    if (wrap.classList.contains('ba-chat-open')) closeChat(); else openChat();
  });
  closeBtn.addEventListener('click', closeChat);
  restartBtn.addEventListener('click', function () {
    messagesEl.innerHTML = '';
    hideForm();
    goTo('root');
  });
  teaserClose.addEventListener('click', function (e) {
    e.stopPropagation();
    dismissTeaser();
  });
  teaser.addEventListener('click', openChat);

  var engaged = false;
  try { engaged = localStorage.getItem('baChatEngaged') === '1'; } catch (e) {}
  if (engaged) wrap.classList.add('ba-chat-engaged');

  var seen = false;
  try { seen = localStorage.getItem('baChatTeaserSeen') === '1'; } catch (e) {}
  if (!seen) {
    setTimeout(function () {
      if (!wrap.classList.contains('ba-chat-open')) teaser.classList.remove('ba-chat-hidden');
    }, 4000);
  }
})();
