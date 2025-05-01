import {
	Card as MuiCard,
	CardContent,
	CardActions,
	Typography,
	Button,
} from "@mui/material";

interface CardProps {
	title: string;
	description: string;
	onAction?: () => void;
}

export function Card({ title, description, onAction }: CardProps) {
	return (
		<MuiCard sx={{ minWidth: 275, mb: 2 }}>
			<CardContent>
				<Typography variant="h5" component="div">
					{title}
				</Typography>
				<Typography variant="body2" color="text.secondary">
					{description}
				</Typography>
			</CardContent>
			{onAction && (
				<CardActions>
					<Button size="small" onClick={onAction}>
						Saiba mais
					</Button>
				</CardActions>
			)}
		</MuiCard>
	);
}
