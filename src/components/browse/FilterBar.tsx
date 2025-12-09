import {
  Paper,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Checkbox,
  ListItemText,
  OutlinedInput,
  Chip,
  Box,
} from '@mui/material';

interface FilterBarProps {
  sortBy: string;
  setSortBy: (value: string) => void;
  filterSizes: string[];
  toggleSize: (size: string) => void;
  filterColors: string[];
  toggleColor: (color: string) => void;
  sizes: string[];
  colors: string[];
  clearFilters: () => void;
}

// Sort sizes in proper clothing order
const sortSizes = (sizes: string[]) => {
  const sizeOrder = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'S/M', 'L/XL', 'One Size'];

  return [...sizes].sort((a, b) => {
    const aIndex = sizeOrder.indexOf(a);
    const bIndex = sizeOrder.indexOf(b);

    if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
    if (aIndex !== -1) return -1;
    if (bIndex !== -1) return 1;

    const aNum = parseInt(a);
    const bNum = parseInt(b);
    if (!isNaN(aNum) && !isNaN(bNum)) return aNum - bNum;

    return a.localeCompare(b);
  });
};

export const FilterBar = ({
  sortBy,
  setSortBy,
  filterSizes,
  toggleSize,
  filterColors,
  toggleColor,
  sizes,
  colors,
  clearFilters,
}: FilterBarProps) => {
  const sortedSizes = sortSizes(sizes);

  return (
    <Paper sx={{ p: 3, mb: 4 }}>
      <Grid container spacing={3} alignItems="center">
        {/* Sort By */}
        <Grid size={{ xs: 12, md: 3 }}>
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
        <Grid size={{ xs: 12, md: 3 }}>
          <FormControl fullWidth size="small">
            <InputLabel>Size</InputLabel>
            <Select
              multiple
              value={filterSizes}
              onChange={(e) => {
                const newValue = e.target.value as string[];
                // Find what was added or removed
                const added = newValue.find((v) => !filterSizes.includes(v));
                const removed = filterSizes.find((v) => !newValue.includes(v));

                if (added) toggleSize(added);
                else if (removed) toggleSize(removed);
              }}
              input={<OutlinedInput label="Size" />}
              renderValue={(selected) =>
                selected.length === 0 ? (
                  'All Sizes'
                ) : (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} size="small" color="secondary" />
                    ))}
                  </Box>
                )
              }
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: 300,
                  },
                },
              }}
            >
              {sortedSizes.map((size) => (
                <MenuItem key={size} value={size}>
                  <Checkbox
                    checked={filterSizes.includes(size)}
                    size="small"
                    sx={{
                      color: 'text.secondary',
                      '&.Mui-checked': {
                        color: 'secondary.main',
                      },
                    }}
                  />
                  <ListItemText primary={size} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Color Filter */}
        <Grid size={{ xs: 12, md: 4 }}>
          <FormControl fullWidth size="small">
            <InputLabel>Color</InputLabel>
            <Select
              multiple
              value={filterColors}
              onChange={(e) => {
                const newValue = e.target.value as string[];
                // Find what was added or removed
                const added = newValue.find((v) => !filterColors.includes(v));
                const removed = filterColors.find((v) => !newValue.includes(v));

                if (added) toggleColor(added);
                else if (removed) toggleColor(removed);
              }}
              input={<OutlinedInput label="Color" />}
              renderValue={(selected) =>
                selected.length === 0 ? (
                  'All Colors'
                ) : (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} size="small" color="secondary" />
                    ))}
                  </Box>
                )
              }
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: 300,
                  },
                },
              }}
            >
              {colors.map((color) => (
                <MenuItem key={color} value={color}>
                  <Checkbox
                    checked={filterColors.includes(color)}
                    size="small"
                    sx={{
                      color: 'text.secondary',
                      '&.Mui-checked': {
                        color: 'secondary.main',
                      },
                    }}
                  />
                  <ListItemText primary={color} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Clear Filters */}
        <Grid size={{ xs: 12, md: 2 }}>
          <Button onClick={clearFilters} variant="contained" color="secondary" fullWidth>
            Clear Filters
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
};
