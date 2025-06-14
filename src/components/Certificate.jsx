import React, { useState } from "react";
import { Modal, IconButton, Box, Typography, Card, CardContent, Backdrop, Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import LinkIcon from "@mui/icons-material/Link";

const Certificate = ({ ImgSertif, title, description, issuer, date, Link }) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleLinkClick = () => {
    if (Link) {
      window.open(Link, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <Box component="div" sx={{ width: "100%", maxWidth: 400, mx: "auto", my: 2 }}>
      {/* Thumbnail Container */}
      <Card
        sx={{
          position: "relative",
          overflow: "hidden",
          borderRadius: 3,
          boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
          transition: "all 0.3s ease",
          "&:hover": {
            transform: "scale(1.02) translateY(-5px)",
            boxShadow: "0 12px 24px rgba(0,0,0,0.2)",
            "& .overlay": {
              opacity: 1,
            },
            "& .hover-content": {
              transform: "translate(-50%, -50%)",
              opacity: 1,
            },
            "& .certificate-image": {
              filter: "contrast(1.1) brightness(1.05) saturate(1.2)",
            },
          },
          bgcolor: "background.paper",
          border: "2px solid #f5f5f5",
          minHeight: 380, // Fixed height for consistency
        }}
      >
        {/* Certificate Image with Initial Filter */}
        <Box
          sx={{
            position: "relative",
            overflow: "hidden",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "linear-gradient(to top, rgba(0,0,0,0.3), transparent)",
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
              filter: "contrast(1.1) brightness(0.95) saturate(1.1)",
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
            bottom: 0, // Full card coverage
            opacity: 0,
            transition: "opacity 0.3s ease",
            cursor: "pointer",
            zIndex: 2,
            background: "linear-gradient(135deg, rgba(255, 138, 0, 0.7), rgba(0, 0, 0, 0.5))",
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
              color: "#fff",
            }}
          >
            <FullscreenIcon
              sx={{
                fontSize: { xs: 32, sm: 40 },
                mb: 1,
                color: "#ff8a00",
              }}
            />
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                fontSize: { xs: "1rem", sm: "1.2rem" },
                color: "#fff",
                textShadow: "0 2px 4px rgba(0,0,0,0.3)",
              }}
            >
              View Certificate
            </Typography>
          </Box>
        </Box>

        {/* Certificate Information */}
        <CardContent
          sx={{
            p: { xs: 2, sm: 3 },
            bgcolor: "background.paper",
            borderTop: "2px solid #ff8a00",
            minHeight: 160, // Ensure consistent content height
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              mb: 1,
              fontSize: { xs: "1.1rem", sm: "1.25rem" },
              color: "#ff8a00",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "normal",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
            }}
          >
            {title || "Certificate"}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 1,
              fontSize: { xs: "0.85rem", sm: "0.9rem" },
              lineHeight: 1.5,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "normal",
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
            }}
          >
            {description || "No description available"}
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              fontSize: { xs: "0.75rem", sm: "0.8rem" },
              display: "block",
              mb: 1.5,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            Issuer: {issuer || "Unknown"} | Date: {date || "Unknown"}
          </Typography>
          {Link && (
            <Button
              variant="contained"
              startIcon={<LinkIcon />}
              onClick={handleLinkClick}
              sx={{
                backgroundColor: "#ff8a00",
                color: "#fff",
                fontWeight: 600,
                textTransform: "none",
                borderRadius: 2,
                px: 3,
                py: 1,
                "&:hover": {
                  backgroundColor: "#e07b00",
                  transform: "translateY(-1px)",
                },
                transition: "all 0.2s ease",
              }}
            >
              View Certificate Link
            </Button>
          )}
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
            backgroundColor: "rgba(0,0,0,0.85)",
            backdropFilter: "blur(8px)",
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
            width: { xs: "95vw", sm: "85vw", md: "75vw", lg: "65vw" },
            maxWidth: 900,
            maxHeight: "90vh",
            bgcolor: "background.paper",
            borderRadius: 3,
            overflowY: "auto",
            p: { xs: 2, sm: 3, md: 4 },
            border: "2px solid #ff8a00",
          }}
        >
          {/* Close Button */}
          <IconButton
            onClick={handleClose}
            aria-label="Close certificate modal"
            sx={{
              position: "absolute",
              right: { xs: 10, sm: 16 },
              top: { xs: 10, sm: 16 },
              color: "#fff",
              bgcolor: "#ff8a00",
              p: { xs: 0.75, sm: 1 },
              "&:hover": {
                bgcolor: "#e07b00",
                transform: "rotate(90deg)",
              },
              transition: "all 0.2s ease",
            }}
          >
            <CloseIcon sx={{ fontSize: { xs: 20, sm: 24 } }} />
          </IconButton>

          {/* Certificate Image */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mb: { xs: 2, sm: 3 },
              maxHeight: { xs: "55vh", sm: "60vh", md: "65vh" },
              overflow: "hidden",
              borderRadius: 2,
              boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
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
                borderRadius: 2,
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
              variant="h5"
              sx={{
                fontWeight: 700,
                mb: 1.5,
                fontSize: { xs: "1.25rem", sm: "1.5rem", md: "1.75rem" },
                color: "#ff8a00",
              }}
            >
              {title || "Certificate"}
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{
                mb: 1.5,
                fontSize: { xs: "0.9rem", sm: "1rem" },
                lineHeight: 1.6,
              }}
            >
              {description || "No description available"}
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                fontSize: { xs: "0.8rem", sm: "0.85rem" },
                mb: 2,
                display: "block",
              }}
            >
              Issuer: {issuer || "Unknown"} | Date: {date || "Unknown"}
            </Typography>
            {Link && (
              <Button
                variant="outlined"
                startIcon={<LinkIcon />}
                onClick={handleLinkClick}
                sx={{
                  borderColor: "#ff8a00",
                  color: "#ff8a00",
                  fontWeight: 600,
                  textTransform: "none",
                  borderRadius: 2,
                  px: 3,
                  py: 1,
                  "&:hover": {
                    backgroundColor: "#ff8a00",
                    color: "#fff",
                    borderColor: "#ff8a00",
                  },
                  transition: "all 0.2s ease",
                }}
              >
                View Certificate Link
              </Button>
            )}
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default Certificate;