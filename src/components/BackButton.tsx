import {Container, IconButton, Typography} from "@mui/material";
import {theme} from "@/util/theme";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import {useRouter} from "next/router";

interface BackButtonProps {
    showText?: boolean;
}


function BackButton({showText = true}) {
    const router = useRouter();

    return (
        <Container>
            <Container className="mt-4 ml-0 p-0 flex flex-row items-center">
                <IconButton
                    className="mr-2 text-white"
                    sx={{
                        backgroundColor: theme.palette.primary.main,
                        '&:hover': {backgroundColor: theme.palette.primary.light}
                    }}
                    onClick={router.back}
                >
                    <KeyboardBackspaceIcon/>
                </IconButton>
                {showText && <Typography component="p" variant="h6">Back</Typography>}
            </Container>
        </Container>
    )
}

export default BackButton;