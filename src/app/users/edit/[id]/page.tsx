'use client';
import { Box, Button, Field, Flex, Grid, GridItem, Heading, HStack, Input, Select, Text, Textarea, VStack } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { Switch } from "@chakra-ui/react"
import {useRouter} from 'next/navigation';
import { useParams } from 'next/navigation';
import { authApi, ocppApi } from '@/app/lib/api';
import { userObject } from '@/app/types/ocpp';

export default function EditUserPage() {
    const params = useParams(); 
    const userId = params?.id as string;
    console.log('user id from params', userId) // get user ID from params
    const router = useRouter()
    const [formData, setFormData] = useState({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '+1 234 567 8900',
        role: 'Admin',
        department: 'Engineering',
        status: 'Active',
        joinDate: '2024-01-15',
        isActive: true,
        receiveNotifications: true,
        bio: 'Experienced software engineer with a passion for building scalable applications.',
    });

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
        alert('User updated successfully!');
    };

    const handleCancel = () => {
        console.log('Form cancelled');
        router.push('/users');
    };
    useEffect(() => {
        // Fetch user data by ID and populate form (mocked here)
        const fetchUserData = async (id: string) => {
            const response = await authApi.getUserByID(id);
            const chunkedDown = response.data.user
            console.log('data from edit page', response)
            if (chunkedDown){
                 setFormData(prev => ({
            ...prev,
            username: chunkedDown.username
            
        }));
            }
        }

        fetchUserData(userId)
    }, []);

    return (
        <Box bg="gray.50" minH="100vh" px={10} py={8}>
            <Box mb={8}>
                <Heading size="2xl" color="gray.900" mb={2}>
                    User Management
                </Heading>
                <Text color="gray.600">Update user information and preferences</Text>
            </Box>

            {/* Main Card */}
            <Box bg="white" rounded="xl" shadow="lg" border="1px" borderColor="gray.200" overflow="hidden">
                {/* Card Header */}
                <Box
                    bgGradient="linear(135deg, #ea2a33 0%, #c41e3a 100%)"
                    px={6}
                    py={5}
                >
                    <Heading size="lg" color="white" display="flex" alignItems="center">
                        <Box as="svg" w="6" h="6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </Box>
                        <Box as="span" ml={2}>Edit User Profile</Box>
                    </Heading>
                </Box>

                {/* Form Content */}
                <Box p={{ base: 6, md: 8 }}>
                    <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={6}>
                        {/* Personal Information Section */}
                        <GridItem colSpan={{ base: 1, md: 2 }}>
                            <Flex align="center" mb={4}>
                                <Box h="1px" bg="gray.300" flex="1" />
                                <Heading
                                    size="xs"
                                    px={4}
                                    color="gray.700"
                                    textTransform="uppercase"
                                    letterSpacing="wider"
                                >
                                    Personal Information
                                </Heading>
                                <Box h="1px" bg="gray.300" flex="1" />
                            </Flex>
                        </GridItem>

                        <GridItem>
                            <Field.Root>
                                <Field.Label color="gray.700" fontSize="sm" fontWeight="semibold" mb={2}>
                                    First Name <Box as="span" color="red.500">*</Box>
                                </Field.Label>
                                <Input
                                    value={formData.firstName}
                                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                                    px={4}
                                    py={2.5}
                                    fontSize="sm"
                                    borderColor="gray.300"
                                    rounded="lg"
                                    placeholder="Enter first name"
                                    _hover={{ borderColor: 'gray.400' }}
                                    _focus={{
                                        outline: 'none',
                                        ring: 2,
                                        ringColor: 'red.500',
                                        borderColor: 'transparent',
                                    }}
                                    transition="all 0.2s"
                                />
                            </Field.Root>
                        </GridItem>

                        <GridItem>
                            <Field.Root>
                                <Field.Label color="gray.700" fontSize="sm" fontWeight="semibold" mb={2}>
                                    Last Name <Box as="span" color="red.500">*</Box>
                                </Field.Label>
                                <Input
                                    value={formData.lastName}
                                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                                    px={4}
                                    py={2.5}
                                    fontSize="sm"
                                    borderColor="gray.300"
                                    rounded="lg"
                                    placeholder="Enter last name"
                                    _hover={{ borderColor: 'gray.400' }}
                                    _focus={{
                                        outline: 'none',
                                        ring: 2,
                                        ringColor: 'red.500',
                                        borderColor: 'transparent',
                                    }}
                                    transition="all 0.2s"
                                />
                            </Field.Root>
                        </GridItem>

                        <GridItem>
                            <Field.Root>
                                <Field.Label color="gray.700" fontSize="sm" fontWeight="semibold" mb={2}>
                                    Email Address <Box as="span" color="red.500">*</Box>
                                </Field.Label>
                                <Box position="relative">
                                    <Box position="absolute" insetY={0} left={0} pl={3} display="flex" alignItems="center" pointerEvents="none">
                                        <Box as="svg" h="5" w="5" color="gray.400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                        </Box>
                                    </Box>
                                    <Input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => handleInputChange('email', e.target.value)}
                                        pl={10}
                                        pr={4}
                                        py={2.5}
                                        fontSize="sm"
                                        borderColor="gray.300"
                                        rounded="lg"
                                        placeholder="user@example.com"
                                        _hover={{ borderColor: 'gray.400' }}
                                        _focus={{
                                            outline: 'none',
                                            ring: 2,
                                            ringColor: 'red.500',
                                            borderColor: 'transparent',
                                        }}
                                        transition="all 0.2s"
                                    />
                                </Box>
                            </Field.Root>
                        </GridItem>

                        <GridItem>
                            <Field.Root>
                                <Field.Label color="gray.700" fontSize="sm" fontWeight="semibold" mb={2}>
                                    Phone Number
                                </Field.Label>
                                <Box position="relative">
                                    <Box position="absolute" insetY={0} left={0} pl={3} display="flex" alignItems="center" pointerEvents="none">
                                        <Box as="svg" h="5" w="5" color="gray.400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </Box>
                                    </Box>
                                    <Input
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => handleInputChange('phone', e.target.value)}
                                        pl={10}
                                        pr={4}
                                        py={2.5}
                                        fontSize="sm"
                                        borderColor="gray.300"
                                        rounded="lg"
                                        placeholder="+1 234 567 8900"
                                        _hover={{ borderColor: 'gray.400' }}
                                        _focus={{
                                            outline: 'none',
                                            ring: 2,
                                            ringColor: 'red.500',
                                            borderColor: 'transparent',
                                        }}
                                        transition="all 0.2s"
                                    />
                                </Box>
                            </Field.Root>
                        </GridItem>

                        {/* Role & Access Section */}
                        <GridItem colSpan={{ base: 1, md: 2 }} mt={6}>
                            <Flex align="center" mb={4}>
                                <Box h="1px" bg="gray.300" flex="1" />
                                <Heading
                                    size="xs"
                                    px={4}
                                    color="gray.700"
                                    textTransform="uppercase"
                                    letterSpacing="wider"
                                >
                                    Role & Access
                                </Heading>
                                <Box h="1px" bg="gray.300" flex="1" />
                            </Flex>
                        </GridItem>

                        <GridItem>
                            <Field.Root>
                                <Field.Label color="gray.700" fontSize="sm" fontWeight="semibold" mb={2}>
                                    Role <Box as="span" color="red.500">*</Box>
                                </Field.Label>
                                <Select.Root
                                    value={[formData.role]}
                                    onValueChange={(e) => handleInputChange('role', e.value[0])}
                                    size="sm"
                                >
                                    <Select.Trigger
                                        px={4}
                                        py={2.5}
                                        fontSize="sm"
                                        borderColor="gray.300"
                                        rounded="lg"
                                        _hover={{ borderColor: 'gray.400' }}
                                        _focus={{
                                            outline: 'none',
                                            ring: 2,
                                            ringColor: 'red.500',
                                            borderColor: 'transparent',
                                        }}
                                        transition="all 0.2s"
                                    >
                                        <Select.ValueText />
                                    </Select.Trigger>
                                    <Select.Content>
                                        <Select.Item item="Admin">
                                            <Select.ItemText>Admin</Select.ItemText>
                                        </Select.Item>
                                        <Select.Item item="Manager">
                                            <Select.ItemText>Manager</Select.ItemText>
                                        </Select.Item>
                                        <Select.Item item="User">
                                            <Select.ItemText>User</Select.ItemText>
                                        </Select.Item>
                                        <Select.Item item="Viewer">
                                            <Select.ItemText>Viewer</Select.ItemText>
                                        </Select.Item>
                                    </Select.Content>
                                </Select.Root>
                            </Field.Root>
                        </GridItem>

                        <GridItem>
                            <Field.Root>
                                <Field.Label color="gray.700" fontSize="sm" fontWeight="semibold" mb={2}>
                                    Department
                                </Field.Label>
                                <Select.Root
                                    value={[formData.department]}
                                    onValueChange={(e) => handleInputChange('department', e.value[0])}
                                    size="sm"
                                >
                                    <Select.Trigger
                                        px={4}
                                        py={2.5}
                                        fontSize="sm"
                                        borderColor="gray.300"
                                        rounded="lg"
                                        _hover={{ borderColor: 'gray.400' }}
                                        _focus={{
                                            outline: 'none',
                                            ring: 2,
                                            ringColor: 'red.500',
                                            borderColor: 'transparent',
                                        }}
                                        transition="all 0.2s"
                                    >
                                        <Select.ValueText />
                                    </Select.Trigger>
                                    <Select.Content>
                                        <Select.Item item="Engineering">
                                            <Select.ItemText>Engineering</Select.ItemText>
                                        </Select.Item>
                                        <Select.Item item="Sales">
                                            <Select.ItemText>Sales</Select.ItemText>
                                        </Select.Item>
                                        <Select.Item item="Marketing">
                                            <Select.ItemText>Marketing</Select.ItemText>
                                        </Select.Item>
                                        <Select.Item item="Support">
                                            <Select.ItemText>Support</Select.ItemText>
                                        </Select.Item>
                                        <Select.Item item="HR">
                                            <Select.ItemText>HR</Select.ItemText>
                                        </Select.Item>
                                    </Select.Content>
                                </Select.Root>
                            </Field.Root>
                        </GridItem>

                        <GridItem>
                            <Field.Root>
                                <Field.Label color="gray.700" fontSize="sm" fontWeight="semibold" mb={2}>
                                    Status
                                </Field.Label>
                                <Select.Root
                                    value={[formData.status]}
                                    onValueChange={(e) => handleInputChange('status', e.value[0])}
                                    size="sm"
                                >
                                    <Select.Trigger
                                        px={4}
                                        py={2.5}
                                        fontSize="sm"
                                        borderColor="gray.300"
                                        rounded="lg"
                                        _hover={{ borderColor: 'gray.400' }}
                                        _focus={{
                                            outline: 'none',
                                            ring: 2,
                                            ringColor: 'red.500',
                                            borderColor: 'transparent',
                                        }}
                                        transition="all 0.2s"
                                    >
                                        <Select.ValueText />
                                    </Select.Trigger>
                                    <Select.Content>
                                        <Select.Item item="Active">
                                            <Select.ItemText>Active</Select.ItemText>
                                        </Select.Item>
                                        <Select.Item item="Inactive">
                                            <Select.ItemText>Inactive</Select.ItemText>
                                        </Select.Item>
                                        <Select.Item item="Suspended">
                                            <Select.ItemText>Suspended</Select.ItemText>
                                        </Select.Item>
                                    </Select.Content>
                                </Select.Root>
                            </Field.Root>
                        </GridItem>

                        <GridItem>
                            <Field.Root>
                                <Field.Label color="gray.700" fontSize="sm" fontWeight="semibold" mb={2}>
                                    Join Date
                                </Field.Label>
                                <Input
                                    type="date"
                                    value={formData.joinDate}
                                    disabled
                                    px={4}
                                    py={2.5}
                                    fontSize="sm"
                                    borderColor="gray.300"
                                    rounded="lg"
                                    bg="gray.50"
                                    color="gray.500"
                                    cursor="not-allowed"
                                />
                            </Field.Root>
                        </GridItem>

                        {/* Additional Information Section */}
                        <GridItem colSpan={{ base: 1, md: 2 }} mt={6}>
                            <Flex align="center" mb={4}>
                                <Box h="1px" bg="gray.300" flex="1" />
                                <Heading
                                    size="xs"
                                    px={4}
                                    color="gray.700"
                                    textTransform="uppercase"
                                    letterSpacing="wider"
                                >
                                    Additional Information
                                </Heading>
                                <Box h="1px" bg="gray.300" flex="1" />
                            </Flex>
                        </GridItem>

                        <GridItem colSpan={{ base: 1, md: 2 }}>
                            <Field.Root>
                                <Field.Label color="gray.700" fontSize="sm" fontWeight="semibold" mb={2}>
                                    Bio
                                </Field.Label>
                                <Textarea
                                    value={formData.bio}
                                    onChange={(e) => handleInputChange('bio', e.target.value)}
                                    rows={4}
                                    px={4}
                                    py={3}
                                    fontSize="sm"
                                    borderColor="gray.300"
                                    rounded="lg"
                                    placeholder="Tell us about yourself..."
                                    resize="none"
                                    _hover={{ borderColor: 'gray.400' }}
                                    _focus={{
                                        outline: 'none',
                                        ring: 2,
                                        ringColor: 'red.500',
                                        borderColor: 'transparent',
                                    }}
                                    transition="all 0.2s"
                                />
                            </Field.Root>
                        </GridItem>

                        {/* Preferences Section */}
                        <GridItem colSpan={{ base: 1, md: 2 }} mt={6}>
                            <Flex align="center" mb={4}>
                                <Box h="1px" bg="gray.300" flex="1" />
                                <Heading
                                    size="xs"
                                    px={4}
                                    color="gray.700"
                                    textTransform="uppercase"
                                    letterSpacing="wider"
                                >
                                    Preferences
                                </Heading>
                                <Box h="1px" bg="gray.300" flex="1" />
                            </Flex>
                        </GridItem>

                        <GridItem>
                            <Box bg="gray.50" p={4} rounded="lg" border="1px" borderColor="gray.200">
                                <Flex align="center" justify="space-between">
                                    <VStack align="flex-start" gap={1}>
                                        <Text color="gray.900" fontSize="sm" fontWeight="semibold">
                                            Account Active
                                        </Text>
                                        <Text fontSize="xs" color="gray.500">
                                            Enable or disable user account
                                        </Text>
                                    </VStack>
                                    <Switch.Root
                                        checked={formData.isActive}
                                        onCheckedChange={(e) => handleInputChange('isActive', e.checked)}
                                        colorPalette="red"
                                    >
                                        <Switch.HiddenInput />
                                        <Switch.Control />
                                    </Switch.Root>
                                </Flex>
                            </Box>
                        </GridItem>

                        <GridItem>
                            <Box bg="gray.50" p={4} rounded="lg" border="1px" borderColor="gray.200">
                                <Flex align="center" justify="space-between">
                                    <VStack align="flex-start" gap={1}>
                                        <Text color="gray.900" fontSize="sm" fontWeight="semibold">
                                            Receive Notifications
                                        </Text>
                                        <Text fontSize="xs" color="gray.500">
                                            Get updates via email
                                        </Text>
                                    </VStack>
                                    <Switch.Root
                                        checked={formData.receiveNotifications}
                                        onCheckedChange={(e) => handleInputChange('receiveNotifications', e.checked)}
                                        colorPalette="red"
                                    >
                                        <Switch.HiddenInput />
                                        <Switch.Control />
                                    </Switch.Root>
                                </Flex>
                            </Box>
                        </GridItem>
                    </Grid>
                </Box>

                {/* Footer Actions */}
                <Flex
                    bg="gray.50"
                    px={6}
                    py={4}
                    borderTop="1px"
                    borderColor="gray.200"
                    justify="space-between"
                    align="center"
                >
                    <Text fontSize="xs" color="gray.500">
                        <Box as="span" color="red.500">*</Box> Required fields
                    </Text>
                    <HStack gap={3}>
                        <Button
                            type="button"
                            onClick={handleCancel}
                            px={6}
                            py={2.5}
                            fontSize="sm"
                            fontWeight="semibold"
                            color="gray.700"
                            bg="white"
                            border="2px"
                            borderColor="gray.300"
                            rounded="lg"
                            shadow="sm"
                            _hover={{
                                bg: 'gray.50',
                                borderColor: 'gray.400',
                            }}
                            _focus={{
                                outline: 'none',
                                ring: 2,
                                ringColor: 'gray.400',
                                ringOffset: 2,
                            }}
                            transition="all 0.2s"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            onClick={handleSubmit}
                            px={6}
                            py={2.5}
                            fontSize="sm"
                            fontWeight="semibold"
                            color="white"
                            bg="#ea2a33"
                            rounded="lg"
                            shadow="md"
                            _hover={{
                                bg: '#d0262d',
                                shadow: 'lg',
                            }}
                            _focus={{
                                outline: 'none',
                                ring: 2,
                                ringOffset: 2,
                            }}
                            transition="all 0.2s"
                        >
                            <Flex align="center">
                                <Box as="svg" w="4" h="4" mr={2} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </Box>
                                <Box as="span">Save Changes</Box>
                            </Flex>
                        </Button>
                    </HStack>
                </Flex>
            </Box>
        </Box>
    );
}