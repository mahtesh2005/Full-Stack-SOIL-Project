const db = require("../database");

exports.getAll = async (req, res) => {
  try {
    const reviews = await db.review.findAll();
    res.json(reviews);
  } catch (error) {
    console.error("Error fetching all reviews:", error);
    res.status(500).json({ error: "Error fetching all reviews" });
  }
};

exports.getByItem = async (req, res) => {
  const { itemID } = req.params;
  const reviews = await db.review.findAll({ where: { itemID } });

  if (reviews.length === 0) {
    res.json("No current Reviews");
  } else {
    res.json(reviews);
  }
};

exports.create = async (req, res) => {
  const { username, itemID, description, stars } = req.body; 

  try {
    const newReview = await db.review.create({
      username,
      itemID,
      description,
      stars
    });
    res.status(201).json(newReview);
  } catch (error) {
    console.error("Error creating review:", error);
    if (error.errors) {
      res.status(400).json({ error: error.errors[0].message });
    } else {
      res.status(500).json({ error: "Error creating review" });
    }
  }
};

exports.update = async (req, res) => {
    try {
        const { reviewID } = req.params;
        const { description, stars } = req.body;

        const updatedReview = await db.review.update(
            { description, stars }, // Updated values
            { where: { reviewID } } // Where clause
        );

        return res.status(200).json({ message: "Review updated successfully", updatedReview });
    } catch (error) {
        console.error("Error updating review:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

exports.delete = async (req, res) => {
    try {
        const { reviewID } = req.params;

        // Delete the review from the database
        await db.review.destroy({ where: { reviewID } });

        // Return success response
        return res.status(200).json({ message: "Review deleted successfully" });
    } catch (error) {
        console.error("Error deleting review:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};
