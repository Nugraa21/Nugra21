import React, { useState } from "react";
import { Modal, IconButton, Box, Typography, Card, CardContent, Backdrop } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import FullscreenIcon from "@mui/icons-material/Fullscreen";

const Certificate = ({ ImgSertif, title, description, issuer, date }) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Box component="div" sx={{ width: "100%", maxWidth: 400, mx: "auto" }}>
      {/* Thumbnail Container */}
      <Card
        sx={{
          position: "relative",
          overflow: "hidden",
          borderRadius: 2,
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          transition: "all 0.3s ease",
          "&:hover": {
            transform: "translateY(-3px)",
            boxShadow: "0 6px 16px rgba(0,0,0,0.15)",
            "& .overlay": {
              opacity: 1,
            },
            "& .hover-content": {
              transform: "translate(-50%, -50%)",
              opacity: 1,
            },
            "& .certificate-image": {
              filter: "contrast(1.05) brightness(1) saturate(1.1)",
            },
          },
          bgcolor: "background.paper",
        }}
      >
        {/* Certificate Image with Initial Filter */}
        <Box
          sx={{
            position: "relative",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.1)",
              zIndex: 1,
            },
          }}
        >
          <img
            className="certificate-image"
            src={ImgSertif}
            alt={title || "Certificate"}
            style={{
              width: "100%",
              height: "auto",
              display: "block",
              objectFit: "cover",
              filter: "contrast(1.10) brightness(0.95) saturate(1.1)",
              transition: "filter 0.3s ease",
            }}
            onClick={handleOpen}
            onError={(e) => {
              console.error(`Failed to load image: ${ImgSertif}`);
              e.target.src = "https://via.placeholder.com/400x300?text=Image+Not+Found";
            }}
          />
        </Box>

        {/* Hover Overlay */}
        <Box
          className="overlay"
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0,
            transition: "opacity 0.3s ease",
            cursor: "pointer",
            zIndex: 2,
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
          onClick={handleOpen}
        >
          {/* Hover Content */}
          <Box
            className="hover-content"
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              opacity: 0,
              transition: "all 0.3s ease",
              textAlign: "center",
              width: "100%",
              color: "white",
            }}
          >
            <FullscreenIcon
              sx={{
                fontSize: { xs: 28, sm: 36 },
                mb: 1,
              }}
            />
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                fontSize: { xs: "0.9rem", sm: "1.1rem" },
              }}
            >
              View Certificate
            </Typography>
          </Box>
        </Box>

        {/* Certificate Information */}
        <CardContent
          sx={{
            p: { xs: 1.5, sm: 2 },
            bgcolor: "background.paper",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              mb: 0.5,
              fontSize: { xs: "1rem", sm: "1.1rem" },
            }}
          >
            {title || "Certificate"}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 0.5,
              fontSize: { xs: "0.8rem", sm: "0.85rem" },
              lineHeight: 1.4,
            }}
          >
            {description || "No description available"}
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ fontSize: { xs: "0.7rem", sm: "0.75rem" } }}
          >
            Issuer: {issuer || "Unknown"} | Date: {date || "Unknown"}
          </Typography>
        </CardContent>
      </Card>

      {/* Modal */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 300,
          sx: {
            backgroundColor: "rgba(0,0,0,0.8)",
            backdropFilter: "blur(5px)",
          },
        }}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: { xs: 1, sm: 2 },
        }}
      >
        <Box
          sx={{
            position: "relative",
            width: { xs: "90vw", sm: "80vw", md: "70vw", lg: "60vw" },
            maxWidth: 800,
            maxHeight: "90vh",
            bgcolor: "background.paper",
            borderRadius: 2,
            overflowY: "auto",
            p: { xs: 1.5, sm: 2, md: 3 },
          }}
        >
          {/* Close Button */}
          <IconButton
            onClick={handleClose}
            aria-label="Close certificate modal"
            sx={{
              position: "absolute",
              right: { xs: 8, sm: 12 },
              top: { xs: 8, sm: 12 },
              color: "text.primary",
              bgcolor: "rgba(0,0,0,0.1)",
              p: { xs: 0.5, sm: 0.75 },
              "&:hover": {
                bgcolor: "rgba(0,0,0,0.2)",
              },
            }}
          >
            <CloseIcon sx={{ fontSize: { xs: 18, sm: 22 } }} />
          </IconButton>

          {/* Certificate Image */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mb: { xs: 1.5, sm: 2 },
              maxHeight: { xs: "50vh", sm: "55vh", md: "60vh" },
              overflow: "hidden",
            }}
          >
            <img
              src={ImgSertif}
              alt={title || "Certificate Full View"}
              style={{
                width: "100%",
                height: "auto",
                maxHeight: "100%",
                objectFit: "contain",
              }}
              onError={(e) => {
                console.error(`Failed to load modal image: ${ImgSertif}`);
                e.target.src = "https://via.placeholder.com/600x400?text=Image+Not+Found";
              }}
            />
          </Box>

          {/* Certificate Details */}
          <Box sx={{ textAlign: "center" }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                mb: 1,
                fontSize: { xs: "1.1rem", sm: "1.25rem", md: "1.5rem" },
              }}
            >
              {title || "Certificate"}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mb: 1,
                fontSize: { xs: "0.8rem", sm: "0.9rem" },
                lineHeight: 1.4,
              }}
            >
              {description || "No description available"}
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                fontSize: { xs: "0.7rem", sm: "0.75rem" },
              }}
            >
              Issuer: {issuer || "Unknown"} | Date: {date || "Unknown"}
            </Typography>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default Certificate;