import React, { useState } from 'react';
import {
  Box,
  Button,
  Grid,
  GridItem,
  Heading,
  Input,
  Select,
  Text,
  VStack,
  HStack,
} from '@chakra-ui/react';
import { Field } from '@chakra-ui/react';

// Type definitions
interface ChargePointConfig {
  chargePointId: string;
  vendor: string;
  model: string;
  firmwareVersion: string;
  networkProfile: string;
  csmsUrl: string;
}

interface ChargePointConfigFormProps {
  initialData?: Partial<ChargePointConfig>;
  onSubmit?: (data: ChargePointConfig) => void;
  onCancel?: () => void;
}

const defaultData: ChargePointConfig = {
  chargePointId: 'CP-001',
  vendor: 'EVBox',
  model: 'Elvi',
  firmwareVersion: '5.12.1',
  networkProfile: 'OCPP 1.6J JSON',
  csmsUrl: 'ws://csms.example.com/ocpp',
};

export const ChargePointConfigForm: React.FC<ChargePointConfigFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState<ChargePointConfig>({
    ...initialData,
    ...defaultData,
  });
console.log({initialData, formData})
  const handleInputChange = (field: keyof ChargePointConfig, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.(formData);
  };

  const handleCancel = () => {
    onCancel?.();
  };

  return (
    <Box bg="white" p={6} rounded="lg" border="1px" borderColor="gray.200">
      <Heading size="lg" mb={6}>
        Charge Point Configuration
      </Heading>
      
      <form onSubmit={handleSubmit}>
        <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={6}>
          <GridItem>
            <Field.Root>
              <Field.Label color="gray.700" fontSize="sm" fontWeight="medium">
                Charge Point ID
              </Field.Label>
              <Input
                value={initialData.chargePoint.id}
                onChange={(e) => handleInputChange('chargePointId', e.target.value)}
                mt={1}
                size="sm"
                borderColor="gray.300"
                _focus={{
                  borderColor: '#ea2a33',
                  boxShadow: '0 0 0 1px #ea2a33',
                }}
              />
            </Field.Root>
          </GridItem>

          <GridItem>
            <Field.Root>
              <Field.Label color="gray.700" fontSize="sm" fontWeight="medium">
                Vendor
              </Field.Label>
              <Input
                value={initialData.chargePoint.vendor}
                onChange={(e) => handleInputChange('vendor', e.target.value)}
                mt={1}
                size="sm"
                borderColor="gray.300"
                _focus={{
                  borderColor: '#ea2a33',
                  boxShadow: '0 0 0 1px #ea2a33',
                }}
              />
            </Field.Root>
          </GridItem>

          <GridItem>
            <Field.Root>
              <Field.Label color="gray.700" fontSize="sm" fontWeight="medium">
                Model
              </Field.Label>
              <Input
                value={initialData.chargePoint.model}
                onChange={(e) => handleInputChange('model', e.target.value)}
                mt={1}
                size="sm"
                borderColor="gray.300"
                _focus={{
                  borderColor: '#ea2a33',
                  boxShadow: '0 0 0 1px #ea2a33',
                }}
              />
            </Field.Root>
          </GridItem>

          <GridItem>
            <Field.Root>
              <Field.Label color="gray.700" fontSize="sm" fontWeight="medium">
                Meter Type
              </Field.Label>
              <Input
                value={initialData.chargePoint.meterType}
                onChange={(e) => handleInputChange('model', e.target.value)}
                mt={1}
                size="sm"
                borderColor="gray.300"
                _focus={{
                  borderColor: '#ea2a33',
                  boxShadow: '0 0 0 1px #ea2a33',
                }}
              />
            </Field.Root>
          </GridItem>

          <GridItem>
            <Field.Root>
              <Field.Label color="gray.700" fontSize="sm" fontWeight="medium">
                Meter Serial Number
              </Field.Label>
              <Input
                value={initialData.chargePoint.meterSerialNumber}
                onChange={(e) => handleInputChange('model', e.target.value)}
                mt={1}
                size="sm"
                borderColor="gray.300"
                _focus={{
                  borderColor: '#ea2a33',
                  boxShadow: '0 0 0 1px #ea2a33',
                }}
              />
            </Field.Root>
          </GridItem>

          <GridItem>
            <Field.Root>
              <Field.Label color="gray.700" fontSize="sm" fontWeight="medium">
                Firmware Version
              </Field.Label>
              <Input
                value={initialData.chargePoint.firmwareVersion}
                onChange={(e) => handleInputChange('firmwareVersion', e.target.value)}
                disabled
                mt={1}
                size="sm"
                borderColor="gray.300"
                bg="gray.50"
                color="gray.500"
              />
            </Field.Root>
          </GridItem>

                    <GridItem>
            <Field.Root>
              <Field.Label color="gray.700" fontSize="sm" fontWeight="medium">
                ICCID Number
              </Field.Label>
              <Input
                value={initialData.chargePoint.iccid}
                onChange={(e) => handleInputChange('firmwareVersion', e.target.value)}
                mt={1}
                size="sm"
                borderColor="gray.300"
                bg="gray.50"
                color="gray.500"
              />
            </Field.Root>
          </GridItem>


          <GridItem colSpan={{ base: 1, md: 2 }}>
            <Box borderTop="1px" borderColor="gray.200" pt={4} mt={2}>
              <Heading size="md" mb={4}>
                Network Parameters
              </Heading>
            </Box>
          </GridItem>

          <GridItem>
            <Field.Root>
              <Field.Label color="gray.700" fontSize="sm" fontWeight="medium">
                Network Profile
              </Field.Label>
              <Select.Root
                value="OCPP 1.6J JSON"
                onValueChange={(e) => handleInputChange('networkProfile', e.value[0])}
                size="sm"
              >
                <Select.Trigger
                  mt={1}
                  borderColor="gray.300"
                  _focus={{
                    borderColor: '#ea2a33',
                    boxShadow: '0 0 0 1px #ea2a33',
                  }}
                >
                  <Select.ValueText />
                </Select.Trigger>
                <Select.Content>
                  <Select.Item item="OCPP 1.6J JSON">
                    <Select.ItemText>OCPP 1.6J JSON</Select.ItemText>
                  </Select.Item>
                  <Select.Item item="OCPP 2.0.1">
                    <Select.ItemText>OCPP 2.0.1</Select.ItemText>
                  </Select.Item>
                </Select.Content>
              </Select.Root>
            </Field.Root>
          </GridItem>

          <GridItem>
            <Field.Root>
              <Field.Label color="gray.700" fontSize="sm" fontWeight="medium">
                CSMS URL
              </Field.Label>
              <Input
                value={formData.csmsUrl}
                onChange={(e) => handleInputChange('csmsUrl', e.target.value)}
                mt={1}
                size="sm"
                borderColor="gray.300"
                _focus={{
                  borderColor: '#ea2a33',
                  boxShadow: '0 0 0 1px #ea2a33',
                }}
              />
            </Field.Root>
          </GridItem>

          <GridItem colSpan={{ base: 1, md: 2 }}>
            <HStack justify="flex-end" gap={3} mt={4}>
              <Button
                type="button"
                variant="outline"
                colorScheme="gray"
                size="sm"
                onClick={handleCancel}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                bg="#ea2a33"
                color="white"
                size="sm"
                _hover={{
                  bg: '#d0262d',
                }}
                _focus={{
                  boxShadow: '0 0 0 2px #ea2a33',
                }}
              >
                Save Changes
              </Button>
            </HStack>
          </GridItem>
        </Grid>
      </form>
    </Box>
  );
};

export default ChargePointConfigForm;