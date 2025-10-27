const WhatsAppContact = () => {
  return (
    <div>
      <a
        href="https://wa.me/8801717362597"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-5 right-5 z-40"
      >
        <div className="relative group">
          <span className="custom-ping absolute inline-flex h-full w-full rounded-full bg-green400 opacity-75"></span>
          <span className="custom-ping delay-200 absolute inline-flex h-full w-full rounded-full bg-green400 opacity-50"></span>

          <div className="relative bg-green500 hover:bg-green600 text-white p-3 lg:p-4 rounded-full shadow-lg transition-all duration-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 lg:w-6 lg:h-6"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M20.52 3.48A11.81 11.81 0 0 0 12 0C5.37 0 0 5.37 0 12a11.8 11.8 0 0 0 1.64 6.01L0 24l6.38-1.66A11.87 11.87 0 0 0 12 24c6.63 0 12-5.37 12-12 0-3.19-1.25-6.18-3.48-8.52zM12 22a9.87 9.87 0 0 1-5.27-1.52l-.38-.25-3.79 1 1.01-3.68-.25-.39A9.9 9.9 0 0 1 2 12c0-5.52 4.48-10 10-10s10 4.48 10 10-4.48 10-10 10zm5.22-7.77c-.29-.14-1.72-.85-1.98-.95-.27-.1-.47-.14-.67.14s-.77.95-.94 1.15-.35.21-.64.07c-.29-.14-1.23-.45-2.34-1.45-.86-.77-1.44-1.72-1.61-2.01-.17-.29-.02-.45.12-.59.12-.12.29-.31.43-.46.14-.15.19-.26.29-.43.1-.17.05-.32-.02-.46-.07-.14-.67-1.61-.91-2.21-.24-.58-.48-.5-.67-.51h-.57c-.2 0-.52.07-.79.35s-1.04 1.02-1.04 2.5 1.06 2.9 1.21 3.1c.15.19 2.09 3.19 5.08 4.47.71.3 1.26.48 1.69.61.71.23 1.36.2 1.87.12.57-.08 1.72-.7 1.97-1.37.24-.67.24-1.25.17-1.37-.06-.12-.26-.19-.54-.33z" />
            </svg>
          </div>
        </div>
      </a>
    </div>
  );
};
export default WhatsAppContact;
