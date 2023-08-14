let editBtn = document.querySelector('#edit');
let editForm = document.querySelector('.editinfo');
let formoff = document.querySelector('#off');
editBtn.addEventListener('click', () => {
    editForm.classList.add('active');
});
formoff.addEventListener('click', () => {
    editForm.classList.remove('active');
})
Handlebars.registerHelper('fileExists', function(filePath) {
    // Đoạn mã kiểm tra sự tồn tại của tệp
    // Trong trường hợp này, bạn có thể sử dụng AJAX, Fetch API hoặc các phương pháp khác để kiểm tra tệp
    // và trả về true hoặc false tương ứng.
    // Dưới đây là ví dụ đơn giản sử dụng Fetch API.
    return fetch(filePath)
        .then(response => response.ok)
        .catch(error => false);
});
// Định nghĩa helper ifEquals

Handlebars.registerHelper('ifEquals', function(arg1, arg2, options) {
    return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
});
