import { Grid, FormControl, InputLabel, Select, MenuItem, Button, Paper } from '@mui/material';

interface FilterBarProps {
  sortBy: string;
  setSortBy: (value: string) => void;
  filterSize: string;
  setFilterSize: (value: string) => void;
  filterColor: string;
  setFilterColor: (value: string) => void;
  clearFilters: () => void;
  sizes: string[];
  colors: string[];
}

export const FilterBar = ({
  sortBy,
  setSortBy,
  filterSize,
  setFilterSize,
  filterColor,
  setFilterColor,
  clearFilters,
  sizes,
  colors,
}: FilterBarProps) => {
  return (
    <Paper sx={{ p: 2, mb: 4, bgcolor: 'background.paper' }} variant="outlined">
      <Grid container spacing={2} alignItems="center">
        {/* Sort By */}
        <Grid size={{ xs: 6, md: 3 }}>
          <FormControl fullWidth size="small">
            <InputLabel>Sort By</InputLabel>
            <Select value={sortBy} label="Sort By" onChange={(e) => setSortBy(e.target.value)}>
              <MenuItem value="default">Featured</MenuItem>
              <MenuItem value="price-asc">Price: Low to High</MenuItem>
              <MenuItem value="price-desc">Price: High to Low</MenuItem>
              <MenuItem value="name-asc">Name: A-Z</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {/* Size Filter */}
        <Grid size={{ xs: 6, md: 3 }}>
          <FormControl fullWidth size="small">
            <InputLabel>Size</InputLabel>
            <Select value={filterSize} label="Size" onChange={(e) => setFilterSize(e.target.value)}>
              <MenuItem value="all">All Sizes</MenuItem>
              {sizes.map((s) => (
                <MenuItem key={s} value={s}>
                  {s}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Color Filter */}
        <Grid size={{ xs: 6, md: 3 }}>
          <FormControl fullWidth size="small">
            <InputLabel>Color</InputLabel>
            <Select
              value={filterColor}
              label="Color"
              onChange={(e) => setFilterColor(e.target.value)}
            >
              <MenuItem value="all">All Colors</MenuItem>
              {colors.map((c) => (
                <MenuItem key={c} value={c}>
                  {c}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Clear Button */}
        <Grid size={{ xs: 6, md: 3 }}>
          <Button variant="contained" color="secondary" fullWidth onClick={clearFilters}>
            Clear Filters
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
};
