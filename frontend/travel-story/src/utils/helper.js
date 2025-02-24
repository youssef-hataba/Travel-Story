export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// function to return the first letter of the first two words in the name and converts them to uppercase.
export const getInitials = (name) => {
  if (!name) return "";

  const words = name.split(" ");
  let initials = "";

  for (let i = 0; i < Math.min(words.length, 2); i++) {
    initials += words[i][0];
  }

  return initials.toUpperCase();
};

export const getEmptyCardMessage = (filterType) => {
  switch (filterType) {
    case "search":
      return "Oops! No stories found matching your search";
    case "date":
      return "Oops! No stories found matching your date range";
    default:
      return `Start creating your first Travel Story! Click the "Add" button to got down your thoughts, ideas and memories. let's get started!`;
  }
};
